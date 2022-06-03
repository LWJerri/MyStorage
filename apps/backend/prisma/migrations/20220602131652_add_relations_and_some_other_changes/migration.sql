/*
  Warnings:

  - Added the required column `memberID` to the `upload` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "member_username_key";

-- AlterTable
ALTER TABLE "upload" ADD COLUMN     "memberID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "upload" ADD CONSTRAINT "upload_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
