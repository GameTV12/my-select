-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "endTime" DROP NOT NULL;
