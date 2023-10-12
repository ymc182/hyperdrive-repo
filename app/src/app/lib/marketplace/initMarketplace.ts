import * as anchor from "@coral-xyz/anchor";
import { MARKETPLACE_PROGRAM_ID, setupNetwork } from "../setup-solana";
import { Marketplace } from "../contract/types/marketplace";
import { Program } from "@coral-xyz/anchor";
import program_idl from "../contract/idl/marketplace.json";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { fetchTokenAccount } from "../solana_nft/fetch-metaplex";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SendTransactionError, Transaction } from "@solana/web3.js";
import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const authoritySeed = "authority";
export const ownerListingsSeed = "owner_listings";
export const nftListingSeed = "listing_pda";

export async function initMarketplace() {
  const { provider, wallet } = await setupNetwork();

  const program_type = Program<Marketplace>;
  const program = new program_type(
    program_idl as any,
    new anchor.web3.PublicKey(MARKETPLACE_PROGRAM_ID),
    provider
  );

  const marketplacePair = anchor.web3.Keypair.generate();
  const [authorityPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(authoritySeed), marketplacePair.publicKey.toBuffer()],
    program.programId
  );

  const initTx = await program.methods
    .initialize(new anchor.BN(5))
    .accounts({
      marketplace: marketplacePair.publicKey,
      marketplaceAuthority: authorityPda,
      signer: wallet.publicKey,
    })
    .signers([marketplacePair])
    .rpc();

  console.log("Init tx: ", initTx);

  console.log("Marketplace initialized");
  console.log("Marketplace Keypair: ", marketplacePair.publicKey.toBase58());
  console.log("Authority: ", authorityPda.toBase58());

  return {
    marketplaceKeypair: marketplacePair.publicKey.toBase58(),
    authority: authorityPda.toBase58(),
  };
}
export async function createListing(
  sellerPk: string,
  nftMint: string,
  price: number
) {
  //MARKETPLACE_ADDRESS=B4thbRD2eC6LPgwoqgNpsYCvuFy1zW25pfEb3BfRx4ZG
  //MARKETPLACE_AUTHORITY=FxtsPkZYHLitAXeUEKW652JJ3bhoXDPoh1MNQtym2pcZ
  const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS!;
  const MARKETPLACE_AUTHORITY = process.env.MARKETPLACE_AUTHORITY!;

  const { provider, wallet } = await setupNetwork();
  const program_type = Program<Marketplace>;
  const marketplaceProgram = new program_type(
    program_idl as any,
    new anchor.web3.PublicKey(MARKETPLACE_PROGRAM_ID),
    provider
  );
  const sellerKP = anchor.web3.Keypair.fromSecretKey(bs58.decode(sellerPk));

  const [listingPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(nftListingSeed),
      new anchor.web3.PublicKey(MARKETPLACE_ADDRESS).toBuffer(),
      sellerKP.publicKey.toBuffer(),
      new anchor.web3.PublicKey(nftMint).toBuffer(),
    ],
    new anchor.web3.PublicKey(MARKETPLACE_PROGRAM_ID)
  );

  const [ownerListingsPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(ownerListingsSeed),
      new anchor.web3.PublicKey(MARKETPLACE_ADDRESS).toBuffer(),
      sellerKP.publicKey.toBuffer(),
    ],
    new anchor.web3.PublicKey(MARKETPLACE_PROGRAM_ID)
  );

  const sellerTokenAccount = await fetchTokenAccount(
    nftMint,
    sellerKP.publicKey.toBase58()
  );

  //send lamports to user account
  const listingTx = await marketplaceProgram.methods
    .listNft(new anchor.BN(0 * anchor.web3.LAMPORTS_PER_SOL))
    .accounts({
      marketplace: new anchor.web3.PublicKey(MARKETPLACE_ADDRESS),
      nftTokenAccount: new anchor.web3.PublicKey(sellerTokenAccount),
      nftMint: new anchor.web3.PublicKey(nftMint),
      listing: listingPda,
      marketplaceAuthority: new anchor.web3.PublicKey(MARKETPLACE_AUTHORITY),
      ownerListings: ownerListingsPda,
      owner: sellerKP.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      feePayer: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([sellerKP])
    .transaction();

  const transaction = new anchor.web3.Transaction().add(listingTx);
  transaction.feePayer = wallet.publicKey;
  try {
    await anchor.web3.sendAndConfirmTransaction(
      provider.connection,
      transaction,
      [wallet.payer, sellerKP]
    );

    const listing = await prisma.listedNFT.create({
      data: {
        nftMint,
        tokenAccountId: sellerTokenAccount,
        listingPda: listingPda.toBase58(),
        listingPrice: price,
      },
    });

    return listing;
  } catch (e: unknown) {
    //if e is SendTransactionError
    if (e instanceof SendTransactionError) {
      if (e.logs![3].includes("already in use")) {
        console.log("NFT already listed");
        const listing = await prisma.listedNFT.upsert({
          where: {
            nftMint,
          },
          update: {
            listingPrice: price,
            tokenAccountId: sellerTokenAccount,
            listingPda: listingPda.toBase58(),
          },
          create: {
            nftMint,
            tokenAccountId: sellerTokenAccount,
            listingPda: listingPda.toBase58(),
            listingPrice: price,
          },
        });
        return listing;
      }
    }
    return null;
  }
}
