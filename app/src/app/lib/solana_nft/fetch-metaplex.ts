import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
import { setupNetwork } from "../setup-solana";
import { Metaplex } from "@metaplex-foundation/js";
import prisma from "@/prisma/prisma";
export async function fetchMetaplexData(nftMint: string) {
  const { program, metaplex, wallet, METADATA_PROGRAM_ID, provider } =
    await setupNetwork();

  const nfts = await metaplex.nfts().findByMint({
    mintAddress: new anchor.web3.PublicKey(nftMint),
  });

  return nfts;
}

export async function refetchMetadata(nftMint: string) {
  const { program, metaplex, wallet, METADATA_PROGRAM_ID, provider } =
    await setupNetwork();

  const nfts = await metaplex.nfts().findByMint({
    mintAddress: new anchor.web3.PublicKey(nftMint),
  });

  const refresh = await metaplex.nfts().refresh(nfts);
  return refresh;
}

export async function fetchTokenAccount(nftMint: string, address: string) {
  const { program, metaplex, wallet, METADATA_PROGRAM_ID, provider } =
    await setupNetwork();
  const tokenAccount = await getAssociatedTokenAddress(
    new anchor.web3.PublicKey(nftMint),
    new anchor.web3.PublicKey(address)
  );
  return tokenAccount.toBase58();
}

export async function fetchTokenAccountByAddress(address: string) {
  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl("devnet")
  );
  const metaplex = Metaplex.make(connection);
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new anchor.web3.PublicKey(address),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const tokenAccountsWith1Amount = accounts.value.filter(
    (account) => account.account.data.parsed.info.tokenAmount.uiAmount === 1
  );

  const nftMints = tokenAccountsWith1Amount.map((account) => {
    return account.account.data.parsed.info.mint;
  });

  const nftMintsMetadata = await Promise.all(
    nftMints.map(async (mint) => {
      const nfts = await metaplex.nfts().findByMint({
        mintAddress: new anchor.web3.PublicKey(mint),
      });
      return nfts;
    })
  );

  const isCollection = "8gFFcY2DEo83gdVRv9XNy67DZLiaXQknmwAZetnQWdK2";

  const nftMintsMetadataFiltered = nftMintsMetadata.filter((nft) => {
    if (nft.updateAuthorityAddress.toBase58() === isCollection) {
      return true;
    }
  });

  const extractedData = nftMintsMetadataFiltered
    .map((nft) => {
      const metadataId = nft.json?.metadataId ?? "";

      if (metadataId != "") {
        return {
          nftMint: nft.mint.address.toBase58(),
          metadataId: nft.json?.metadataId ?? "",
        };
      }
    })
    .filter((nft) => nft != undefined);

  const withFetchedMetadata = await Promise.all(
    extractedData.map(async (nft) => {
      const metadata = await prisma.nFTMetadata.findUnique({
        where: {
          metadataId: nft?.metadataId as string,
        },
      });
      return {
        ...nft,
        metadata,
      };
    })
  );

  return withFetchedMetadata;
}
