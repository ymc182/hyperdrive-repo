import { web3 } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { fetchTokenAccount } from "@/app/lib/solana_nft/fetch-metaplex";
import { createListing } from "@/app/lib/marketplace/initMarketplace";
export async function POST(req: NextRequest) {
  const body = await req.json();

  const sk = body.sk;
  const nftMint = body.nftMint;
  const price = body.price;

  console.log(body);

  if (!sk || !nftMint || !price) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await createListing(sk, nftMint, price);

  if (!result) {
    return NextResponse.json(
      { error: "Error creating listing" },
      { status: 400 }
    );
  }
  return NextResponse.json(result);
}
