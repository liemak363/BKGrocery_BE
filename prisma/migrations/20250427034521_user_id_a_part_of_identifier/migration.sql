/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name,userId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_userId_key" ON "Product"("name", "userId");
