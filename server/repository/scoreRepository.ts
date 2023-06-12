import type { BoardModel } from '$/commonTypesWithClient/models';
import { getBoard } from './board/boardRepository';

export type Score = { blackScore: number; whiteScore: number };

export const scoreRepository = {
  getScore: async (lobbyId: BoardModel['lobbyId']): Promise<Score> => {
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
  },
};
