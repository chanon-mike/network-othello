/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lobbyId` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Board` table. All the data in the column will be lost.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boardId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Lobby` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lobbyName` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Made the column `currentTurnUserId` on table `Board` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `in` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_lobbyId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_lobbyId_fkey";

-- DropIndex
DROP INDEX "Board_lobbyId_key";

-- DropIndex
DROP INDEX "Player_userId_key";

-- AlterTable
ALTER TABLE "Board" DROP CONSTRAINT "Board_pkey",
DROP COLUMN "lobbyId",
DROP COLUMN "updatedAt",
ADD COLUMN     "lobbyName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "currentTurnUserId" SET NOT NULL,
ADD CONSTRAINT "Board_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Board_id_seq";

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "boardId",
DROP COLUMN "createdAt",
DROP COLUMN "displayName",
DROP COLUMN "id",
ADD COLUMN     "in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "out" TIMESTAMP(3),
ALTER COLUMN "lobbyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("userId", "lobbyId");

-- DropTable
DROP TABLE "Lobby";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
