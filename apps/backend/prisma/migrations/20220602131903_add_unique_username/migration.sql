/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "member_username_key" ON "member"("username");
