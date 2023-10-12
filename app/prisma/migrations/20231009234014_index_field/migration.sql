/*
  Warnings:

  - You are about to drop the column `nftMint` on the `NFTs` table. All the data in the column will be lost.
  - Added the required column `nftMetadataId` to the `NFTs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFTs" DROP CONSTRAINT "NFTs_nftMint_fkey";

-- DropIndex
DROP INDEX "nftMint";

-- DropIndex
DROP INDEX "NFTs_nftMint_key";

-- DropIndex
DROP INDEX "nftAddress";

-- AlterTable
ALTER TABLE "NFTs" DROP COLUMN "nftMint",
ADD COLUMN     "nftMetadataId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "metadataId" ON "NFTMetadata"("metadataId");

-- CreateIndex
CREATE INDEX "nftMetadataId" ON "NFTs"("nftMetadataId");

-- AddForeignKey
ALTER TABLE "NFTs" ADD CONSTRAINT "NFTs_nftMetadataId_fkey" FOREIGN KEY ("nftMetadataId") REFERENCES "NFTMetadata"("metadataId") ON DELETE RESTRICT ON UPDATE CASCADE;
