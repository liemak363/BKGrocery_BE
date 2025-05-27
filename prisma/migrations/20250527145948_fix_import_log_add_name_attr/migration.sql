/*
  Warnings:

  - Added the required column `name` to the `ImportLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportLog" ADD COLUMN     "name" TEXT NOT NULL;
