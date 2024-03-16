-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEFAULT_USER', 'ADMIN', 'MODERATOR', 'BANNED_USER');

-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "firstVerification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'DEFAULT_USER',
ADD COLUMN     "secondVerification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unlockTime" TIMESTAMP(3);
