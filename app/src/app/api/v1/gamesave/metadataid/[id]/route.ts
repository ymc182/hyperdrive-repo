import {
  fetchMetaplexData,
  refetchMetadata,
} from "@/app/lib/solana_nft/fetch-metaplex";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  if (!params.id) {
    return NextResponse.json(
      {
        error: "Missing id",
      },
      {
        status: 400,
      }
    );
  }

  const metadata = await prisma.nFTMetadata.findUnique({
    where: {
      metadataId: params.id,
    },
  });

  if (!metadata) {
    return NextResponse.json(
      {
        error: "Metadata not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(metadata.attributes);
}
