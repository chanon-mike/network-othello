import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorRepository } from './userColorRepository';

export type BoardArray = number[][];
export type Pos = { x: number; y: number };

const board: BoardArray = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const directions = [
  [-1, 0], // Up
  [-1, 1], // Up-Right
  [0, 1], // Right
  [1, 1], // Down-Right
  [1, 0], // Down
  [1, -1], // Down-Left
  [0, -1], // Left
  [-1, -1], // Up-Left
];

export const boardRepository = {
  getBoard: (): BoardArray => board,
  clickBoard: (params: Pos, userId: UserId): BoardArray => {
    board[params.y][params.x] = userColorRepository.getUserColor(userId);
    return board;
  },
  getValidMoves: (userId: UserId): Pos[] => {
    const board = boardRepository.getBoard();
    const validMoves: Pos[] = [];

    // Loop through each cell in the board and find valid moves
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        board[y][x] === 0 &&
          directions.forEach((direction) => {
            const [dx, dy] = direction;
            const newX = x + dx;
            const newY = y + dy;

            if (isValidMove(newX, newY, dx, dy, board, userId)) {
              validMoves.push({ x, y });
            }
          });
      })
    );

    return validMoves;
  },
};

// If the position is within the board boundaries
const isValidPosition = (x: number, y: number, board: BoardArray): boolean => {
  return x >= 0 && x < board[0].length && y >= 0 && y < board.length;
};

// If there are same color discs between new disc and another disc, else false
const findSameColorInLine = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  board: BoardArray,
  userColor: number
): boolean => {
  while (isValidPosition(x, y, board)) {
    const currDisc = board[y][x];

    if (currDisc === 0) {
      return false;
    } else if (currDisc === userColor) {
      return true;
    }

    x += dx;
    y += dy;
  }
  return false;
};

// Check if the move is valid or not
const isValidMove = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  board: BoardArray,
  userId: UserId
): boolean => {
  const userColor = userColorRepository.getUserColor(userId);

  if (isValidPosition(x, y, board) && board[y][x] !== 0 && board[y][x] !== userColor) {
    const currX = x + dx;
    const currY = y + dy;

    // Return true if there are same color discs between new disc and another disc, else false
    return findSameColorInLine(currX, currY, dx, dy, board, userColor);
  }
  return false;
};
