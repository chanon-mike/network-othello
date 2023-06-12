import type { BoardModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import { getBoard } from './board/boardRepository';
import { getUserColorDict, type UserColorDict } from './playerRepository';

export type Score = { blackScore: number; whiteScore: number };

export const getScore = async (lobbyId: BoardModel['lobbyId']): Promise<Score> => {
  const prismaBoard = await getBoard(lobbyId);
  const boardData = prismaBoard.boardData;
  let blackScore = 0;
  let whiteScore = 0;

  boardData.forEach((row, y) =>
    row.forEach((_, x) => {
      if (boardData[y][x] === 1) {
        blackScore += 1;
      } else if (boardData[y][x] === 2) {
        whiteScore += 1;
      }
    })
  );

  return { blackScore, whiteScore };
};

export const setScore = async (lobbyId: BoardModel['lobbyId']): Promise<void> => {
  const userColorDict: UserColorDict = await getUserColorDict(lobbyId);
  const { blackScore, whiteScore } = await getScore(lobbyId);
  // Update black and white player score
  await prismaClient.player.update({
    where: { userId: userColorDict.black },
    data: { score: blackScore },
  });
  await prismaClient.player.update({
    where: { userId: userColorDict.white },
    data: { score: whiteScore },
  });
};
