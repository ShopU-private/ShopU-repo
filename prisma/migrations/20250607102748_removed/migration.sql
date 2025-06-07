/*
  Warnings:

  - You are about to drop the column `full_name` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `UserAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "full_name",
DROP COLUMN "phone_number";
