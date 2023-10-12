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
  const data = await refetchMetadata(params.id);

  return NextResponse.json(data);
}
