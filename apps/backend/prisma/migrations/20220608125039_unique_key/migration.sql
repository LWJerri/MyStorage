/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `upload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "upload_key_key" ON "upload"("key");
