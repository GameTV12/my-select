-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_courtId_fkey";

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "courtId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
