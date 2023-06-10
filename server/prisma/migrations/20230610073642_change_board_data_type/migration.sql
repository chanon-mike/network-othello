/*
  Warnings:

  - Changed the type of `boardData` on the `Board` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "boardData",
ADD COLUMN     "boardData" JSONB NOT NULL;
