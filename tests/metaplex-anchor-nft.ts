import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MetaplexAnchorNft } from "../target/types/metaplex_anchor_nft";
import { Metaplex } from "@metaplex-foundation/js";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
	TOKEN_PROGRAM_ID,
	createAssociatedTokenAccountInstruction,
	getAssociatedTokenAddress,
	createInitializeMintInstruction,
	MINT_SIZE,
} from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
const { SystemProgram } = anchor.web3;
describe("metaplex-anchor-nft", () => {
	// Configure the client to use the local cluster.
});

export async function mintCollectionNft(program: Program<MetaplexAnchorNft>, walletPublicKey: anchor.web3.PublicKey) {
	const wallet = anchor.Wallet.local();
	const provider = anchor.getProvider();
	const metaplex = Metaplex.make(provider.connection);
	const METADATA_PROGRAM_ID = new anchor.web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID as string);
	const testMetadata = {
		uri: "https://arweave.net/h19GMcMz7RLDY7kAHGWeWolHTmO83mLLMNPzEkF32BQ",
		name: "NAME",
		symbol: "SYMBOL",
	};
	const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("Collection")], program.programId);

	const collectionMetadataPDA = metaplex.nfts().pdas().metadata({ mint: collectionPDA });
	const collectionMasterEditionPDA = metaplex.nfts().pdas().masterEdition({ mint: collectionPDA });

	const collectionTokenAccount = await getAssociatedTokenAddress(collectionPDA, wallet.publicKey);

	const tx = await program.methods
		.mintCollectionNft(testMetadata.uri, testMetadata.name, testMetadata.symbol)
		.accounts({
			authority: wallet.publicKey,
			collectionMint: collectionPDA,
			metadataAccount: collectionMetadataPDA,
			masterEdition: collectionMasterEditionPDA,
			tokenAccount: collectionTokenAccount,
			tokenMetadataProgram: METADATA_PROGRAM_ID,
		})
		.rpc();

	return {
		nftMint: collectionPDA.toBase58(),
		nftTokenAccount: collectionTokenAccount.toBase58(),
		metadataAddress: collectionMetadataPDA.toBase58(),
		masterEdition: collectionMasterEditionPDA.toBase58(),
	};
}

export async function mintNft(program: Program<MetaplexAnchorNft>, walletPublicKey: anchor.web3.PublicKey) {
	const wallet = anchor.Wallet.local();
	const provider = anchor.getProvider();
	const metaplex = Metaplex.make(provider.connection);
	const METADATA_PROGRAM_ID = new anchor.web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID as string);
	const testMetadata = {
		uri: "https://arweave.net/h19GMcMz7RLDY7kAHGWeWolHTmO83mLLMNPzEkF32BQ",
		name: "NAME",
		symbol: "SYMBOL",
	};
	const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("Collection")], program.programId);
	const mint = anchor.web3.Keypair.generate();
	const metadataPDA = metaplex.nfts().pdas().metadata({ mint: mint.publicKey });

	const masterEditionPDA = metaplex.nfts().pdas().masterEdition({ mint: mint.publicKey });

	const tokenAccount = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey);

	const collectionMetadataPDA = metaplex.nfts().pdas().metadata({ mint: collectionPDA });

	const collectionMasterEditionPDA = metaplex.nfts().pdas().masterEdition({ mint: collectionPDA });
	const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
		units: 300_000,
	});
	const tx = await program.methods
		.mintNft(testMetadata.uri, testMetadata.name, testMetadata.symbol)
		.accounts({
			payer: wallet.publicKey,
			collectionMint: collectionPDA,
			collectionMetadataAccount: collectionMetadataPDA,
			collectionMasterEdition: collectionMasterEditionPDA,
			nftMint: mint.publicKey,
			receiver: wallet.publicKey,
			metadataAccount: metadataPDA,
			masterEdition: masterEditionPDA,
			tokenAccount: tokenAccount,
			tokenMetadataProgram: METADATA_PROGRAM_ID,
		})
		.transaction();

	const transaction = new anchor.web3.Transaction().add(modifyComputeUnits, tx);

	const txSig = await anchor.web3.sendAndConfirmTransaction(provider.connection, transaction, [wallet.payer, mint]);

	console.log("txSig", txSig);

	return {
		nftMint: mint.publicKey.toBase58(),
		tokenAccount: tokenAccount.toBase58(),
		metadataAddress: metadataPDA.toBase58(),
		masterEdition: masterEditionPDA.toBase58(),
	};
}
