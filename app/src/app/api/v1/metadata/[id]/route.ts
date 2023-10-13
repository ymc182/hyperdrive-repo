import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
type PlayerData = {
  UpgradeCards: {
    [key: string]: {
      amount: number;
      level: number;
    };
  };
  currencies: {
    [key: string]: {
      amount: number;
    };
  };
};

type Attribute = {
  trait_type: string;
  value: string;
};

type AttributesWrapper = {
  attributes: Attribute[];
};
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
  //check is id appended with .json

  if (params.id.endsWith(".json")) {
    params.id = params.id.replace(".json", "");
  }

  const metadata = await prisma.nFTMetadata.findUnique({
    where: {
      metadataId: params.id,
    },
  });

  if (!metadata) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const keyToDisplayName: { [key: string]: string } = {
    "gun.1": "Desert Eagle",
    "gun.2": "Assault Rifle",
    "armor.1": "Armor",
    "helper.1": "Helper",
    energy: "Energy",
    gems: "Gems",
    money: "Money",
  };
  const transformToAttributes = (input: string): AttributesWrapper => {
    const data: PlayerData = JSON.parse(input);
    const attributes: Attribute[] = [];

    for (const key in data.UpgradeCards) {
      if (keyToDisplayName[key]) {
        attributes.push({
          trait_type: keyToDisplayName[key],
          value: data.UpgradeCards[key].level.toString(),
        });
      }
    }
    for (const key in data.currencies) {
      if (keyToDisplayName[key]) {
        attributes.push({
          trait_type: keyToDisplayName[key],
          value: data.currencies[key].amount.toString(),
        });
      }
    }

    return { attributes };
  };

  const result = transformToAttributes(metadata.attributes?.toString() || "");

  return NextResponse.json({
    ...metadata,
    attributes: result.attributes,
    createdAt: undefined,
    updatedAt: undefined,
  });
}
