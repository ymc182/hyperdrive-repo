import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { MetaplexAnchorNft as NFTProgram } from "./contract/types/metaplex_anchor_nft";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import program_idl from "./contract/idl//metaplex_anchor_nft.json";
import { getAssociatedTokenAddress } from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
import { Keypair } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
export const NFT_PROGRAM_ID = process.env.MINTER_PROGRAM_ID!;
export const MARKETPLACE_PROGRAM_ID = process.env.MARKETPLACE_PROGRAM_ID!;
const SECRET_KEY = process.env.SECRET_KEY!;
export async function setupNetwork() {
  const wallet = new anchor.Wallet(
    Keypair.fromSecretKey(new Uint8Array(JSON.parse(SECRET_KEY)))
  );

  const connection = new anchor.web3.Connection(web3.clusterApiUrl("devnet"));
  const METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    MPL_TOKEN_METADATA_PROGRAM_ID as string
  );

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const program_type = Program<NFTProgram>;
  const program = new program_type(
    program_idl as any,
    new anchor.web3.PublicKey(NFT_PROGRAM_ID),
    provider
  );
  const metaplex = Metaplex.make(provider.connection);

  return {
    program,
    metaplex,
    wallet,
    connection,
    METADATA_PROGRAM_ID,
    provider,
  };
}
