/*
  Warnings:

  - You are about to drop the column `isGameEnd` on the `Board` table. All the data in the column will be lost.
  - Added the required column `status` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "isGameEnd",
ADD COLUMN     "status" TEXT NOT NULL;
