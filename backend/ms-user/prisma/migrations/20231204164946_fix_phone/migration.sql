-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Followers" ALTER COLUMN "start" SET DEFAULT CURRENT_TIMESTAMP;
