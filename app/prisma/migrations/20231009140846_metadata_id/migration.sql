-- CreateTable
CREATE TABLE "NFTMetadata" (
    "nftMint" TEXT NOT NULL,
    "metadataId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "external_url" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTMetadata_pkey" PRIMARY KEY ("nftMint")
);

-- CreateTable
CREATE TABLE "NFTCollection" (
    "nftMint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTCollection_pkey" PRIMARY KEY ("nftMint")
);

-- CreateTable
CREATE TABLE "NFTs" (
    "id" TEXT NOT NULL,
    "nftMint" TEXT NOT NULL,
    "collectionMint" TEXT NOT NULL,

    CONSTRAINT "NFTs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFTMetadata_metadataId_key" ON "NFTMetadata"("metadataId");

-- CreateIndex
CREATE INDEX "nftMint" ON "NFTMetadata"("nftMint");

-- CreateIndex
CREATE UNIQUE INDEX "NFTs_nftMint_key" ON "NFTs"("nftMint");

-- CreateIndex
CREATE INDEX "nftAddress" ON "NFTs"("nftMint");

-- AddForeignKey
ALTER TABLE "NFTs" ADD CONSTRAINT "NFTs_nftMint_fkey" FOREIGN KEY ("nftMint") REFERENCES "NFTMetadata"("nftMint") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTs" ADD CONSTRAINT "NFTs_collectionMint_fkey" FOREIGN KEY ("collectionMint") REFERENCES "NFTCollection"("nftMint") ON DELETE RESTRICT ON UPDATE CASCADE;
