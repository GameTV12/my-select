/*
  Warnings:

  - You are about to drop the column `emailSent` on the `AuthUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuthUser" DROP COLUMN "emailSent",
ADD COLUMN     "sent" BOOLEAN NOT NULL DEFAULT false;
