import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import cuid from "cuid";
import { mintNft } from "@/app/lib/solana_nft/mint_nft";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const address = body.address;
  const medadataId = body.metadataId;

  if (!address || !body.attributes) {
    return NextResponse.json(
      {
        error: "Missing address or metadataId or attributes",
      },
      {
        status: 400,
      }
    );
  }
  const metadata = await prisma.nFTMetadata.upsert({
    where: {
      metadataId: medadataId,
    },
    update: {
      metadataId: medadataId,
      attributes: body.attributes,
      image: "https://i.ibb.co/hM3Qn38/ezgif-5-eaed82287f.png",
    },
    create: {
      metadataId: medadataId,
      attributes: body.attributes,
      name: "BaseDefender NFT",
      image: "https://i.ibb.co/hM3Qn38/ezgif-5-eaed82287f.png",
    },
  });
  console.log("minting nft");
  const mintData = await mintNft(
    address,
    `https://sync-api-dev.up.railway.app/api/metadata/${medadataId}.json`,
    "BaseDefender NFT",
    "BDNFT"
  );

  await prisma.nFTs.upsert({
    where: {
      nftMetadataId: medadataId,
    },
    update: {
      nftMetadataId: medadataId,
      collectionMint: "8gFFcY2DEo83gdVRv9XNy67DZLiaXQknmwAZetnQWdK2",
      nftMint: mintData.nftMint,
    },
    create: {
      nftMetadataId: medadataId,
      collectionMint: "8gFFcY2DEo83gdVRv9XNy67DZLiaXQknmwAZetnQWdK2",
      nftMint: mintData.nftMint,
    },
  });

  return NextResponse.json(metadata);
}
