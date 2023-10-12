-- AlterTable
ALTER TABLE "NFTMetadata" ADD CONSTRAINT "NFTMetadata_pkey" PRIMARY KEY ("metadataId");

-- AlterTable
ALTER TABLE "NFTs" ADD CONSTRAINT "NFTs_pkey" PRIMARY KEY ("nftMint");
