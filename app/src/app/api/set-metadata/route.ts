import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import cuid from "cuid";
import { refetchMetadata } from "@/app/lib/solana_nft/fetch-metaplex";
export async function POST(request: NextRequest) {
  const body = await request.json();

  const medadataId = body.metadataId;

  if (!medadataId) {
    return NextResponse.json({ error: "Missing metadataId" }, { status: 400 });
  }

  if (!body.attributes) {
    return NextResponse.json({ error: "Missing attributes" }, { status: 400 });
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

  const token = await prisma.nFTs.findUnique({
    where: {
      nftMetadataId: medadataId,
    },
  });

  if (token) {
    await refetchMetadata(token.nftMint);
  }

  return NextResponse.json(metadata);
}
