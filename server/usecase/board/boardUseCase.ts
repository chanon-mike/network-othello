import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel } from '$/commonTypesWithClient/models';
import type { Pos } from '$/repository/boardRepository';
import { boardRepository } from '$/repository/boardRepository';
import { playerRepository } from '$/repository/playerRepository';
import { lobbyIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';
import { playerUseCase } from '../playerUseCase';
import { flipDisc, isValidMove } from './boardUtils';

const initBoard = () => [
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

export const boardUseCase = {
  create: async (lobbyName: string, userId: UserId): Promise<BoardModel> => {
    const newBoard: BoardModel = {
      id: lobbyIdParser.parse(randomUUID()),
      lobbyName,
      boardData: initBoard(),
      latestMove: { x: 0, y: 0 },
      isGameEnd: false,
      currentTurnUserId: userId,
      created: Date.now(),
    };
    console.log(newBoard);
    // Right now when create board, current user need to be pass, so maybe create board before player
    await boardRepository.save(newBoard);

    return newBoard;
  },
  clickBoard: async (lobbyId: string, params: Pos, userId: UserId): Promise<BoardModel> => {
    const prismaBoard = await boardRepository.getCurrent(lobbyId);
    const prismaPlayer = await playerRepository.getByUserId(lobbyId, userId);
    let newBoard: BoardModel = prismaBoard;
    let currentTurnUserId = prismaBoard.currentTurnUserId;

    // Clickable if this player turn
    if (currentTurnUserId === userId) {
      const boardData = prismaBoard.boardData;
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

      // Update new board before valid move check before switch turn
      newBoard = {
        id: prismaBoard.id,
        lobbyName: prismaBoard.lobbyName,
        boardData,
        latestMove,
        isGameEnd: false,
        currentTurnUserId,
        created: prismaBoard.created,
      };
      await boardRepository.save(newBoard);

      // Set score, game end, turn
      await playerUseCase.setScore(lobbyId);
      const isGameEnd = await boardUseCase.isGameFinish(lobbyId);
      currentTurnUserId = await playerUseCase.switchTurn(lobbyId, currentTurnUserId);

      // Save a final result
      newBoard.isGameEnd = isGameEnd;
      newBoard.currentTurnUserId = currentTurnUserId;
      await boardRepository.save(newBoard);
    }
    return newBoard;
  },
  getValidMoves: async (lobbyId: string, userId: UserId): Promise<Pos[]> => {
    const prismaBoard = await boardRepository.getCurrent(lobbyId);
    const prismaPlayer = await playerRepository.getByUserId(lobbyId, userId);

    // Get a list of valid moves, board, and color
    const validMoves: Pos[] = [];
    const boardData = prismaBoard.boardData;
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
  },
  isGameFinish: async (lobbyId: string): Promise<boolean> => {
    const userColorDict = await playerUseCase.getAllPlayerTurn(lobbyId);
    const blackPlayer = userColorDict.black;
    const whitePlayer = userColorDict.white;

    // Check if black and whtie have any valid move left
    if (blackPlayer && whitePlayer) {
      const blackMoveable =
        (await boardUseCase.getValidMoves(lobbyId, blackPlayer.userId)).length === 0;
      const whiteMoveable =
        (await boardUseCase.getValidMoves(lobbyId, whitePlayer.userId)).length === 0;
      return blackMoveable && whiteMoveable;
    }

    return false;
  },
  resetBoard: async (lobbyId: string): Promise<void> => {
    const thisBoard = await boardRepository.getCurrent(lobbyId);
    const playerList = await playerRepository.getAllInLobby(lobbyId);

    // Reset board, latest move and current player turn
    if (playerList) {
      const startTurnUserId =
        playerList[0].color === 1 ? playerList[0].userId : playerList[1].userId;
      const newBoard: BoardModel = {
        id: thisBoard.id,
        lobbyName: thisBoard.lobbyName,
        boardData: initBoard(),
        latestMove: undefined,
        isGameEnd: false,
        currentTurnUserId: startTurnUserId,
        created: Date.now(),
      };
      await boardRepository.save(newBoard);
      playerUseCase.setScore(lobbyId);
    }
  },
};
