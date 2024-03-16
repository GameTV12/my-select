/*
  Warnings:

  - Changed the type of `type` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Reaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('POST', 'VARIANT');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "type",
ADD COLUMN     "type" "CommentType" NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "type",
ADD COLUMN     "type" "ReactionType" NOT NULL;

-- DropEnum
DROP TYPE "Type";
