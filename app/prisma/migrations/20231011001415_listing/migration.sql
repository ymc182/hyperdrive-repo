-- AlterTable
ALTER TABLE "NFTMetadata" ALTER COLUMN "image" SET DEFAULT 'https://i.ibb.co/hM3Qn38/ezgif-5-eaed82287f.png';

-- CreateTable
CREATE TABLE "ListedNFT" (
    "nftMint" TEXT NOT NULL,
    "tokenAccountId" TEXT NOT NULL,
    "listingPda" TEXT NOT NULL,
    "listingPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ListedNFT_pkey" PRIMARY KEY ("nftMint")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListedNFT_nftMint_key" ON "ListedNFT"("nftMint");

-- AddForeignKey
ALTER TABLE "ListedNFT" ADD CONSTRAINT "ListedNFT_nftMint_fkey" FOREIGN KEY ("nftMint") REFERENCES "NFTs"("nftMint") ON DELETE RESTRICT ON UPDATE CASCADE;
