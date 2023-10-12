/*
  Warnings:

  - The primary key for the `NFTMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nftMint` on the `NFTMetadata` table. All the data in the column will be lost.
  - The primary key for the `NFTs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NFTs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nftMint]` on the table `NFTCollection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nftMint]` on the table `NFTs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nftMint` to the `NFTs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFTMetadata" DROP CONSTRAINT "NFTMetadata_pkey",
DROP COLUMN "nftMint";

-- AlterTable
ALTER TABLE "NFTs" DROP CONSTRAINT "NFTs_pkey",
DROP COLUMN "id",
ADD COLUMN     "nftMint" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NFTCollection_nftMint_key" ON "NFTCollection"("nftMint");

-- CreateIndex
CREATE UNIQUE INDEX "NFTs_nftMint_key" ON "NFTs"("nftMint");
