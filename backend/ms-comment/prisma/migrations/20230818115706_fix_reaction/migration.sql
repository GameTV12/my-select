/*
  Warnings:

  - Made the column `goalId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyTo_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "replyTo" DROP NOT NULL,
ALTER COLUMN "goalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "endTime" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
