import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      metadataId: string;
    };
  }
) {
  //check is id appended with .json

  const metadata = await prisma.nFTMetadata.findUnique({
    where: {
      metadataId: params.metadataId,
    },
  });

  if (!metadata) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const nft = await prisma.nFTs.findUnique({
    where: {
      nftMetadataId: params.metadataId,
    },
  });

  if (!nft) {
    return NextResponse.json({ error: "NFT Not found" }, { status: 404 });
  }

  const nftMint = nft.nftMint;

  request.headers.set("Content-Type", "application/json");

  //return metadata without createdAt and updatedAt
  return NextResponse.json({});
}
