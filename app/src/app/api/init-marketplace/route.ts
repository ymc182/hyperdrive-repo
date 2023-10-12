import { initMarketplace } from "@/app/lib/marketplace/initMarketplace";
import { NextResponse } from "next/server";

export async function GET() {
  //const marketplaceData = await initMarketplace();

  //return NextResponse.json(marketplaceData);
  //
  return NextResponse.json({
    error: "suspended for now",
  });
}
