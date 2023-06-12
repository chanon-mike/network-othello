import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Board } from '@prisma/client';
import { getCurrentTurn, getUserColorDict, switchTurn } from '../playerRepository';
import { setScore } from '../scoreRepository';
import { flipDisc, getBoardByLobbyId, getPlayerByUserId, isValidMove } from './boardUtils';

export type BoardArray = number[][];
export type Pos = { x: number; y: number };

// Inital board
const initialBoard: BoardArray = [
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

const toModel = (prismaBoard: Board): BoardModel => ({
  id: prismaBoard.id,
  lobbyId: prismaBoard.lobbyId,
  boardData: prismaBoard.boardData as BoardArray,
  latestMove: prismaBoard.latestMove as Pos,
  isGameEnd: prismaBoard.isGameEnd,
  currentTurnUserId: prismaBoard.currentTurnUserId as UserId,
  created: prismaBoard.createdAt.getTime(),
  updated: prismaBoard.updatedAt.getTime(),
});

export const getBoard = async (lobbyId: BoardModel['lobbyId']): Promise<BoardModel> => {
  const prismaBoard = await prismaClient.board.findFirst({
    where: { lobbyId },
  });
  // Handle the case when the board is not found
  if (!prismaBoard) throw new Error("Board doesn't exist");

  return toModel(prismaBoard);
};

export const createBoard = async (lobbyId: BoardModel['lobbyId']): Promise<BoardModel> => {
  // Create a new board
  const prismaBoard = await prismaClient.board.create({
    data: {
      boardData: initialBoard,
      latestMove: undefined,
      isGameEnd: false,
      currentTurnUserId: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      lobby: {
        connect: {
          id: lobbyId,
        },
      },
    },
  });
  return toModel(prismaBoard);
};

export const clickBoard = async (
  lobbyId: BoardModel['lobbyId'],
  params: Pos,
  userId: UserId
): Promise<BoardModel> => {
  // Get current board and current player
  const prismaBoard = await getBoardByLobbyId(lobbyId);
  const prismaPlayer = await getPlayerByUserId(userId);
  const boardData: BoardArray = prismaBoard.boardData as BoardArray;
  let currentTurnUserId = await getCurrentTurn(prismaBoard.lobbyId);

  // Place disc and flip disc if current turn is current player
  if (currentTurnUserId === userId) {
    const userColor = prismaPlayer.color;
    const latestMove = { x: params.x, y: params.y };

    boardData[params.y][params.x] = userColor;
    directions.forEach((direction) => {
      const [dx, dy] = direction;
      const newX = params.x + dx;
      const newY = params.y + dy;
      if (isValidMove(newX, newY, dx, dy, userColor, boardData))
        flipDisc(newX, newY, dx, dy, userColor, boardData);
    });

    // Set new score for each player
    await setScore(lobbyId);

    // Switch to opponent turn and update board if valid
    currentTurnUserId = await switchTurn(lobbyId);
    await prismaClient.board.update({
      where: { lobbyId },
      data: { boardData, currentTurnUserId, latestMove },
    });
  }
  return toModel(prismaBoard);
};

export const getValidMoves = async (lobbyId: BoardModel['id'], userId: UserId): Promise<Pos[]> => {
  // Get current board and current player
  const prismaBoard = await getBoardByLobbyId(lobbyId);
  const prismaPlayer = await getPlayerByUserId(userId);

  // Get a list of valid moves, board, and color
  const boardData: BoardArray = prismaBoard.boardData as BoardArray;
  const validMoves: Pos[] = [];
  const userColor = prismaPlayer.color;

  // Loop through each cell in the board and find valid moves
  boardData.forEach((row, y) =>
    row.forEach((_, x) => {
      boardData[y][x] === 0 &&
        directions.forEach((direction) => {
          const [dx, dy] = direction;
          const newX = x + dx;
          const newY = y + dy;

          if (isValidMove(newX, newY, dx, dy, userColor, boardData)) {
            validMoves.push({ x, y });
          }
        });
    })
  );

  return validMoves;
};

export const isGameEnd = async (lobbyId: BoardModel['id']): Promise<boolean> => {
  // Fetch player in this lobby with board info
  const prismaPlayer = await prismaClient.player.findMany({
    where: { lobbyId },
    include: {
      board: true,
    },
  });
  if (!prismaPlayer) throw new Error("User doesn't exist");

  const userColorDict = await getUserColorDict(lobbyId);
  const blackUserId = userColorDict.black;
  const whiteUserId = userColorDict.white;

  // Check if black and whtie have any valid move left
  const isBlackMoveValid =
    blackUserId !== undefined && (await getValidMoves(lobbyId, blackUserId)).length === 0;
  const isWhiteMoveValid =
    whiteUserId !== undefined && (await getValidMoves(lobbyId, whiteUserId)).length === 0;

  return isBlackMoveValid && isWhiteMoveValid;
};

export const resetBoard = async (lobbyId: BoardModel['lobbyId']): Promise<void> => {
  // Reset board, latest move and current player turn
  await prismaClient.board.update({
    where: { lobbyId },
    data: {
      boardData: initialBoard,
      latestMove: {},
      isGameEnd: false,
      currentTurnUserId: undefined,
    },
  });
};
