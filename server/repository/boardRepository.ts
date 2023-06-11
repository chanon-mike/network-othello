import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel, LobbyModel, PlayerModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Board } from '@prisma/client';
import { getCurrentTurn, playerRepository } from './playerRepository';

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
let latestMove: Pos;

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

export const getBoard = async (lobbyId: PlayerModel['lobbyId']): Promise<BoardModel> => {
  const prismaBoard = await prismaClient.board.findFirst({
    where: { lobbyId },
  });
  if (prismaBoard === null) {
    // Handle the case when the board is not found
    throw new Error('Board not found');
  }
  return toModel(prismaBoard);
};

export const createBoard = async (lobbyId: PlayerModel['lobbyId']): Promise<BoardModel> => {
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
  lobbyId: PlayerModel['lobbyId'],
  params: Pos,
  userId: UserId
): Promise<BoardModel> => {
  // Get current board and current player
  const prismaBoard = await prismaClient.board.findFirst({ where: { lobbyId } });
  if (!prismaBoard) throw new Error("Board doesn't exist");
  const boardData: BoardArray = prismaBoard.boardData as BoardArray;

  const currentTurnUserId = await getCurrentTurn(prismaBoard.lobbyId);
  const prismaPlayer = await prismaClient.player.findFirst({
    where: {
      userId: currentTurnUserId,
      lobbyId,
    },
  });
  if (!prismaPlayer) throw new Error("Player doesn't exist");

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

    // Switch to opponent turn and update board if valid
    await prismaClient.board.update({
      where: { lobbyId },
      data: { boardData, currentTurnUserId, latestMove },
    });
  }
  return toModel(prismaBoard);
};

export const getValidMoves = async (lobbyId: LobbyModel['id'], userId: UserId): Promise<Pos[]> => {
  // Get current board and current player
  const prismaBoard = await prismaClient.board.findFirst({ where: { lobbyId } });
  if (!prismaBoard) throw new Error("Board doesn't exist");
  const boardData: BoardArray = prismaBoard.boardData as BoardArray;

  const prismaPlayer = await prismaClient.player.findFirst({
    where: {
      userId,
      lobbyId,
    },
  });
  if (!prismaPlayer) throw new Error("Player doesn't exist");

  // Get a list of valid moves
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

export const boardRepository = {
  getBoard: (): BoardArray => board,
  clickBoard: (params: Pos, userId: UserId): BoardArray => {
    const currentPlayer = playerRepository.getCurrentPlayer();
    // Place disc and flip disc if current turn is current player
    if (currentPlayer === userId) {
      const userColor = playerRepository.getUserColor(userId);

      latestMove = { x: params.x, y: params.y };
      board[params.y][params.x] = userColor;
      directions.forEach((direction) => {
        const [dx, dy] = direction;
        const newX = params.x + dx;
        const newY = params.y + dy;
        if (isValidMove(newX, newY, dx, dy, userColor, board))
          flipDisc(newX, newY, dx, dy, userColor, board);
      });

      // Switch to opponent turn if valid
      playerRepository.setCurrentPlayer(playerRepository.switchPlayerTurnWithValidation());
    }

    return board;
  },
  getValidMoves: (userId: UserId): Pos[] => {
    // Get a list of valid moves
    const validMoves: Pos[] = [];
    const userColor = playerRepository.getUserColor(userId);

    // Loop through each cell in the board and find valid moves
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        board[y][x] === 0 &&
          directions.forEach((direction) => {
            const [dx, dy] = direction;
            const newX = x + dx;
            const newY = y + dy;

            if (isValidMove(newX, newY, dx, dy, userColor, board)) {
              validMoves.push({ x, y });
            }
          });
      })
    );

    return validMoves;
  },
  getLatestMove: (): Pos => {
    return latestMove;
  },
  isGameEnd: (): boolean => {
    const userColorDict = playerRepository.getUserColorDict();
    const blackUserId = userColorDict.black;
    const whiteUserId = userColorDict.white;

    if (
      blackUserId !== undefined &&
      boardRepository.getValidMoves(blackUserId).length === 0 &&
      whiteUserId !== undefined &&
      boardRepository.getValidMoves(whiteUserId).length === 0
    ) {
      return true;
    }

    return false;
  },
  restart: (): void => {
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

    // Reset board, latest move and current player turn
    Object.assign(board, initialBoard);
    latestMove = { x: 0, y: 0 };
    playerRepository.setCurrentPlayer(undefined);
  },
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

// Check if the move is valid or not
const isValidMove = (
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

// function to flip disc after place a new one
const flipDisc = (
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
