/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `VipUser` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `VipUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VipUser" DROP COLUMN "expiresAt",
DROP COLUMN "isActive";
