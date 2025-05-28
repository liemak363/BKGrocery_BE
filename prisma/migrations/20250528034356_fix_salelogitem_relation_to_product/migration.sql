/*
  Warnings:

  - Added the required column `userId` to the `SaleLogItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaleLogItem" DROP CONSTRAINT "SaleLogItem_productId_saleLogId_fkey";

-- AlterTable
ALTER TABLE "SaleLogItem" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SaleLogItem" ADD CONSTRAINT "SaleLogItem_productId_userId_fkey" FOREIGN KEY ("productId", "userId") REFERENCES "Product"("id", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
