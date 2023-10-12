import * as anchor from "@coral-xyz/anchor";

import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY

import { setupNetwork } from "../setup-solana";
export async function mintNft(
  receiver: string,
  uri: string,
  name: string,
  symbol: string
) {
  const { program, metaplex, wallet, METADATA_PROGRAM_ID, provider } =
    await setupNetwork();

  const Metadata = {
    uri: uri,
    name: name,
    symbol: symbol,
  };

  const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Collection")],
    program.programId
  );

  const mint = anchor.web3.Keypair.generate();
  const metadataPDA = metaplex.nfts().pdas().metadata({ mint: mint.publicKey });

  const masterEditionPDA = metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: mint.publicKey });

  const tokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    new anchor.web3.PublicKey(receiver)
  );

  const collectionMetadataPDA = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: collectionPDA });

  const collectionMasterEditionPDA = metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: collectionPDA });
  const modifyComputeUnits =
    anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
      units: 300_000,
    });

  const tx = await program.methods
    .mintNft(Metadata.uri, Metadata.name, Metadata.symbol)
    .accounts({
      payer: wallet.publicKey,
      receiver: new anchor.web3.PublicKey(receiver),
      collectionMint: collectionPDA,
      collectionMetadataAccount: collectionMetadataPDA,
      collectionMasterEdition: collectionMasterEditionPDA,
      nftMint: mint.publicKey,
      metadataAccount: metadataPDA,
      masterEdition: masterEditionPDA,
      tokenAccount: tokenAccount,
      tokenMetadataProgram: METADATA_PROGRAM_ID,
    })
    .transaction();

  const transaction = new anchor.web3.Transaction().add(modifyComputeUnits, tx);

  const txSig = await anchor.web3.sendAndConfirmTransaction(
    provider.connection,
    transaction,
    [wallet.payer, mint],
    {
      commitment: "finalized",
    }
  );

  console.log("txSig", txSig);
  return {
    nftMint: mint.publicKey.toBase58(),
    tokenAccount: tokenAccount.toBase58(),
    metadataAddress: metadataPDA.toBase58(),
    masterEdition: masterEditionPDA.toBase58(),
    updateAuthority: collectionPDA.toBase58(),
  };
}
