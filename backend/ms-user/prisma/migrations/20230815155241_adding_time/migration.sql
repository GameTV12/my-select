/*
  Warnings:

  - The primary key for the `Followers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `end` to the `Followers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Followers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_pkey",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Followers_pkey" PRIMARY KEY ("follower", "following", "start");
