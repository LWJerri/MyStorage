-- AlterTable
ALTER TABLE "member" ADD COLUMN     "accessKey" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "bucket" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "secretKey" TEXT NOT NULL DEFAULT E'';
