/*
  Warnings:

  - A unique constraint covering the columns `[nftMetadataId]` on the table `NFTs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NFTs_nftMetadataId_key" ON "NFTs"("nftMetadataId");
