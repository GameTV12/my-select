/*
  Warnings:

  - The values [COMMENT] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('POST', 'VARIANT');
ALTER TABLE "Comment" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postId",
DROP COLUMN "variantId",
ADD COLUMN     "goalId" TEXT;
