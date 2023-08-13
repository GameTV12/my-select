/*
  Warnings:

  - Added the required column `photo` to the `ShortUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEFAULT_USER', 'ADMIN', 'MODERATOR', 'BANNED_USER');

-- AlterTable
ALTER TABLE "ShortUser" ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'DEFAULT_USER',
ADD COLUMN     "secondVerification" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "visible" SET DEFAULT true;
