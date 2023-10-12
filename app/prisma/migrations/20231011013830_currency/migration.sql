-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('SOL', 'IAP', 'IGC');

-- AlterTable
ALTER TABLE "ListedNFT" ADD COLUMN     "listingCurrency" TEXT NOT NULL DEFAULT 'IAP';
