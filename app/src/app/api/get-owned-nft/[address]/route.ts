import { fetchTokenAccountByAddress } from "@/app/lib/solana_nft/fetch-metaplex";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      address: string;
    };
  }
) {
  if (!params.address) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const accounts = await fetchTokenAccountByAddress(params.address);
  return NextResponse.json(accounts);
}
