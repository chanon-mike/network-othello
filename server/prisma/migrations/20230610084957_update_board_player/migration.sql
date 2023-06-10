-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_currentTurnPlayerId_fkey";

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "currentTurnPlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_currentTurnPlayerId_fkey" FOREIGN KEY ("currentTurnPlayerId") REFERENCES "Player"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
