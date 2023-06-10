/*
  Warnings:

  - You are about to drop the column `currentTurnPlayerId` on the `Board` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_currentTurnPlayerId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "currentTurnPlayerId",
ADD COLUMN     "currentTurnUserId" TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "boardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
