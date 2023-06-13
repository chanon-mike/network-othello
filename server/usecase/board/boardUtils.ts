import type { BoardArray } from '$/repository/board/boardRepository';

export const isValidMove = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  userColor: number,
  board: BoardArray
): boolean => {
  if (isInsideBoard(x, y, board) && board[y][x] !== 0 && board[y][x] !== userColor) {
    const currX = x + dx;
    const currY = y + dy;

    // Return true if there are same color discs between new disc and another disc, else false
    return isSameColorInLine(currX, currY, dx, dy, userColor, board);
  }
  return false;
};

export const flipDisc = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  userColor: number,
  board: BoardArray
): void => {
  // function to flip disc after place a new one
  let currX = x;
  let currY = y;

  while (board[currY][currX] === 2 / userColor) {
    board[currY][currX] = userColor;
    currX += dx;
    currY += dy;
  }
};

// If the position is within the board boundaries
const isInsideBoard = (x: number, y: number, board: BoardArray): boolean => {
  return x >= 0 && x < board[0].length && y >= 0 && y < board.length;
};

// If there are same color discs between new disc and another disc, else false
const isSameColorInLine = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  userColor: number,
  board: BoardArray
): boolean => {
  while (isInsideBoard(x, y, board)) {
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
