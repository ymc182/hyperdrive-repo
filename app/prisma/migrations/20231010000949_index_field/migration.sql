-- AlterTable
ALTER TABLE "NFTCollection" ALTER COLUMN "externalUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NFTMetadata" ADD COLUMN     "symbol" TEXT NOT NULL DEFAULT 'SSNFT',
ALTER COLUMN "name" SET DEFAULT 'SaveSync NFT',
ALTER COLUMN "image" SET DEFAULT 'https://play-lh.googleusercontent.com/yo7tFpXwfIFeEcmvTs6m_lPK0ZzWo5U-kqj61RvVQgRA6H_ZtWpsZR1R2Q6we0mZ0tk0',
ALTER COLUMN "external_url" DROP NOT NULL,
ALTER COLUMN "external_url" SET DEFAULT '';
