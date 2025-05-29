/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SaleLogItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ImportLog" DROP CONSTRAINT "ImportLog_productId_userId_fkey";

-- DropForeignKey
ALTER TABLE "SaleLogItem" DROP CONSTRAINT "SaleLogItem_productId_userId_fkey";

-- AlterTable
ALTER TABLE "ImportLog" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id", "userId");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "SaleLogItem" DROP CONSTRAINT "SaleLogItem_pkey",
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SaleLogItem_pkey" PRIMARY KEY ("saleLogId", "productId");

-- AddForeignKey
ALTER TABLE "ImportLog" ADD CONSTRAINT "ImportLog_productId_userId_fkey" FOREIGN KEY ("productId", "userId") REFERENCES "Product"("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleLogItem" ADD CONSTRAINT "SaleLogItem_productId_userId_fkey" FOREIGN KEY ("productId", "userId") REFERENCES "Product"("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
