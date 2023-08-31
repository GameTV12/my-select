-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photo" SET DEFAULT '',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "firstVerification" SET DEFAULT false;
