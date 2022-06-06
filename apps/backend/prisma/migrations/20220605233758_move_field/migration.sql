/*
  Warnings:

  - You are about to drop the column `maxGB` on the `upload` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member" ADD COLUMN     "maxGB" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "upload" DROP COLUMN "maxGB";
