import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Marketplace } from "../target/types/marketplace";
import { BN } from "bn.js";
import fs from "fs";
import { MetaplexAnchorNft } from "../target/types/metaplex_anchor_nft";
import { mintCollectionNft, mintNft } from "./metaplex-anchor-nft";
import {
  TOKEN_PROGRAM_ID,
  MintLayout,
  AccountLayout,
  createAssociatedTokenAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { expect } from "chai";
describe("marketplace deploy", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();
  const wallet = anchor.Wallet.local();
  const marketplaceProgram = anchor.workspace
    .Marketplace as Program<Marketplace>;

  const marketplaceProgramId = marketplaceProgram.programId;

  const authoritySeed = "authority";
  const ownerListingsSeed = "owner_listings";
  const nftListingSeed = "listing_pda";
  anchor.setProvider(anchor.AnchorProvider.env());
  const walletPublicKey = provider.publicKey;

  const nftProgram = anchor.workspace
    .MetaplexAnchorNft as Program<MetaplexAnchorNft>;

  it("Is initialized!", async () => {
    const marketplacePair = anchor.web3.Keypair.generate();
    const [authorityPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(authoritySeed), marketplacePair.publicKey.toBuffer()],
      marketplaceProgramId
    );

    const tx = await marketplaceProgram.methods
      .initialize(new BN(12))
      .accounts({
        marketplace: marketplacePair.publicKey,
        marketplaceAuthority: authorityPda,
        signer: provider.publicKey,
      })
      .signers([marketplacePair])
      .rpc();

    console.log("Your transaction signature", tx);
    // const collectionData = await mintCollectionNft(nftProgram, walletPublicKey);
    // console.table(collectionData);
    const mintData = await mintNft(nftProgram, walletPublicKey);
    console.table(mintData);

    //==================================list item===================================
    // #[account(init, seeds = [b"listing_pda".as_ref(), marketplace.key().as_ref(), owner.key().as_ref(), nft_token_account.key().as_ref()], bump, payer = owner, space = 4 + 8 + 32)]
    const [listingPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(nftListingSeed),
        marketplacePair.publicKey.toBuffer(),
        walletPublicKey.toBuffer(),
        new anchor.web3.PublicKey(mintData.nftMint).toBuffer(),
      ],
      marketplaceProgramId
    );
    const [ownerListingsPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(ownerListingsSeed),
        marketplacePair.publicKey.toBuffer(),
        walletPublicKey.toBuffer(),
      ],
      marketplaceProgramId
    );

    await marketplaceProgram.methods
      .listNft(new BN(5 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        marketplace: marketplacePair.publicKey,
        nftTokenAccount: new anchor.web3.PublicKey(mintData.tokenAccount),
        nftMint: new anchor.web3.PublicKey(mintData.nftMint),
        listing: listingPda,
        marketplaceAuthority: authorityPda,
        ownerListings: ownerListingsPda,
        owner: walletPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,

        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    //get the state of the token mint
    const tokenAccount = await provider.connection.getAccountInfo(
      new anchor.web3.PublicKey(mintData.tokenAccount)
    );
    const tokenAccountState = AccountLayout.decode(tokenAccount.data);
    console.table(tokenAccountState);
    expect(tokenAccountState.delegate.toBase58()).to.equal(
      authorityPda.toBase58()
    );

    const listingData = await marketplaceProgram.account.listing.fetch(
      listingPda
    );

    const seller = listingData.owner;

    const newUser = anchor.web3.Keypair.generate();
    //send some SOL to the new user

    const tx2 = await provider.connection.requestAirdrop(
      newUser.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(tx2);

    //purchase the item

    //create assiocated token account for the new user
    const NftTokenAccount = await getAssociatedTokenAddress(
      new anchor.web3.PublicKey(mintData.nftMint),
      newUser.publicKey
    );
    const buyerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      new anchor.web3.PublicKey(mintData.nftMint),
      newUser.publicKey
    );

    const buyTx = await marketplaceProgram.methods
      .purchaseNft()
      .accounts({
        listing: listingPda,
        marketplace: marketplacePair.publicKey,
        buyer: newUser.publicKey,
        seller: seller,
        systemProgram: anchor.web3.SystemProgram.programId,
        nftTokenAccount: new anchor.web3.PublicKey(mintData.tokenAccount),
        nftMint: new anchor.web3.PublicKey(mintData.nftMint),
        buyerTokenAccount: buyerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        marketplaceAuthority: authorityPda,
      })
      .signers([newUser])
      .rpc({});
    await provider.connection.confirmTransaction(buyTx);

    //check user nft balance

    //User List again
    const [newListingPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(nftListingSeed),
        marketplacePair.publicKey.toBuffer(),
        newUser.publicKey.toBuffer(),
        new anchor.web3.PublicKey(mintData.nftMint).toBuffer(),
      ],
      marketplaceProgramId
    );
    const [newOwnerListingsPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(ownerListingsSeed),
        marketplacePair.publicKey.toBuffer(),
        newUser.publicKey.toBuffer(),
      ],
      marketplaceProgramId
    );

    await marketplaceProgram.methods
      .listNft(new BN(5 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        marketplace: marketplacePair.publicKey,
        nftTokenAccount: new anchor.web3.PublicKey(NftTokenAccount),
        nftMint: new anchor.web3.PublicKey(mintData.nftMint),
        listing: newListingPda,
        marketplaceAuthority: authorityPda,
        ownerListings: newOwnerListingsPda,
        owner: newUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newUser])
      .rpc();

    //check approval
    const newListingData = await marketplaceProgram.account.listing.fetch(
      newListingPda
    );
    const newSeller = newListingData.owner.toBase58();
    expect(newSeller).to.equal(newUser.publicKey.toBase58());
    const userNftTokenAccount = await provider.connection.getAccountInfo(
      NftTokenAccount
    );
    const userNftTokenAccountState = AccountLayout.decode(
      userNftTokenAccount.data
    );

    console.table(userNftTokenAccountState);

    expect(userNftTokenAccountState.owner.toBase58()).to.equal(
      newUser.publicKey.toBase58()
    );
  });
});
