/*
  Warnings:

  - Added the required column `token` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "member" ADD COLUMN     "token" TEXT NOT NULL;
