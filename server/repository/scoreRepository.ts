import type { BoardArray } from './board/boardRepository';
import { boardRepository } from './board/boardRepository';

export type Score = { blackScore: number; whiteScore: number };

export const scoreRepository = {
  getScore: (): Score => {
    const board: BoardArray = boardRepository.getBoard();
    let blackScore = 0;
    let whiteScore = 0;

    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (board[y][x] === 1) {
          blackScore += 1;
        } else if (board[y][x] === 2) {
          whiteScore += 1;
        }
      })
    );

    return { blackScore, whiteScore };
  },
};
