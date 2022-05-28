/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `upload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "upload_id_key" ON "upload"("id");
