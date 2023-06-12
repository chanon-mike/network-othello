import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Board, Player } from '@prisma/client';
import type { BoardArray } from './boardRepository';

export const getBoardByLobbyId = async (lobbyId: BoardModel['id']): Promise<Board> => {
  // Get current board
  const prismaBoard = await prismaClient.board.findFirst({ where: { lobbyId } });
  if (!prismaBoard) throw new Error("Board doesn't exist");
  return prismaBoard;
};

export const getPlayerByUserId = async (userId: UserId): Promise<Player> => {
  // Get current player
  const prismaPlayer = await prismaClient.player.findFirst({ where: { userId } });
  if (!prismaPlayer) throw new Error("Player doesn't exist");
  return prismaPlayer;
};

// Check if the move is valid or not
export const isValidMove = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  userColor: number,
  board: BoardArray
): boolean => {
  if (isInsideBoard(x, y, board) && board[y][x] !== 0 && board[y][x] !== userColor) {
    // console.log('color', userColor, 'x', x, 'y', y);
    const currX = x + dx;
    const currY = y + dy;

    // Return true if there are same color discs between new disc and another disc, else false
    return isSameColorInLine(currX, currY, dx, dy, userColor, board);
  }
  return false;
};

// function to flip disc after place a new one
export const flipDisc = (
  x: number,
  y: number,
  dx: number,
  dy: number,
  userColor: number,
  board: BoardArray
): void => {
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
      // console.log('color', userColor, 'true', 'x', x, 'y', y);
      return true;
    }

    x += dx;
    y += dy;
  }
  return false;
};
