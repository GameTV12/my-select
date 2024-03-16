/*
  Warnings:

  - You are about to drop the column `sent` on the `AuthUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuthUser" DROP COLUMN "sent",
ADD COLUMN     "letter" BOOLEAN DEFAULT false;
