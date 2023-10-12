import * as anchor from "@coral-xyz/anchor";

import { getAssociatedTokenAddress } from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY

import { setupNetwork } from "../setup-solana";
import prisma from "@/prisma/prisma";

export async function mintCollectionNft() {
  const { program, metaplex, wallet } = await setupNetwork();

  const testMetadata = {
    uri: "https://arweave.net/h19GMcMz7RLDY7kAHGWeWolHTmO83mLLMNPzEkF32BQ",
    name: "SaveSync-Test-Collection",
    symbol: "SS-TEST",
  };

  const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("Collection")],
    program.programId
  );

  const collectionMetadataPDA = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: collectionPDA });
  const collectionMasterEditionPDA = metaplex
    .nfts()
    .pdas()
    .masterEdition({ mint: collectionPDA });

  const collectionTokenAccount = await getAssociatedTokenAddress(
    collectionPDA,
    wallet.publicKey
  );

  await prisma.nFTCollection.create({
    data: {
      nftMint: collectionPDA.toBase58(),
      name: testMetadata.name,
      image: testMetadata.uri,
      description: "SaveSync Test Collection",
      externalUrl: "",
    },
  });

  return {
    nftMint: collectionPDA.toBase58(),
    nftTokenAccount: collectionTokenAccount.toBase58(),
    metadataAddress: collectionMetadataPDA.toBase58(),
    masterEdition: collectionMasterEditionPDA.toBase58(),
  };
}
