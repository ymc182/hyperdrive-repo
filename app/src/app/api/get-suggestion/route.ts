import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(request: NextRequest) {
  const metadata = createRandomMetadata();

  request.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  return NextResponse.json({
    metadata,
    price: Math.floor(Math.random() * 500) + 150,
  });
}

function createRandomMetadata() {
  const metadataID = v4().replace(/-/g, "");
  const randomGun1Lv = Math.floor(Math.random() * 10) + 2;
  const randomGun2Lv = Math.floor(Math.random() * 8) + 3;
  const randomArmorLv = Math.floor(Math.random() * 10) + 2;
  const randomHelperLv = Math.floor(Math.random() * 8) + 3;
  const randomEnergy = Math.floor(Math.random() * 100) + 50;
  const randomGems = Math.floor(Math.random() * 100) + 50;
  const randomMoney = Math.floor(Math.random() * 100) + 50;

  const attributeString = `{"UpgradeCards":{"armor.1":{"amount":0,"level":${randomArmorLv}},"gun.2":{"amount":0,"level":${randomGun2Lv}},"gun.1":{"amount":0,"level":${randomGun1Lv}},"helper.1":{"amount":0,"level":${randomHelperLv}}},"currencies":{"energy":{"amount":${randomEnergy}},"gems":{"amount":${randomGems}},"money":{"amount":${randomMoney}},"skipit":{"amount":0}}}`;
  return {
    metadataId: metadataID,
    metadata: {
      metadataId: metadataID,
      name: "BaseDefender NFT",
      image: "https://i.ibb.co/hM3Qn38/ezgif-5-eaed82287f.png",
      external_url: "",
      symbol: "SSNFT",
      attributes: attributeString,
      createdAt: "2023-10-12T08:38:48.955Z",
      updatedAt: "2023-10-12T08:38:48.957Z",
    },
  };
}
