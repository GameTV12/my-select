/*
  Warnings:

  - Changed the type of `type` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('POST', 'COMMENT');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL;
