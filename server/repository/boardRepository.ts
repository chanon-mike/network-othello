import type { BoardModel } from '$/commonTypesWithClient/models';
import { UserIdParser, lobbyIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Board } from '@prisma/client';
import { z } from 'zod';

export type BoardArray = number[][];
export type Pos = { x: number; y: number };
export type GameStatus = 'waiting' | 'playing' | 'ended';

const toModel = (prismaBoard: Board): BoardModel => ({
  id: lobbyIdParser.parse(prismaBoard.id),
  lobbyName: prismaBoard.lobbyName !== null ? z.string().parse(prismaBoard.lobbyName) : '',
  boardData: z.array(z.array(z.number())).parse(prismaBoard.boardData),
  latestMove:
    prismaBoard.latestMove !== null
      ? z
          .object({
            x: z.number(),
            y: z.number(),
          })
          .parse(prismaBoard.latestMove)
      : undefined,
  status: z.enum(['waiting', 'playing', 'ended']).parse(prismaBoard.status),
  currentTurnUserId: UserIdParser.parse(prismaBoard.currentTurnUserId),
  created: prismaBoard.createdAt.getTime(),
  createdBy: UserIdParser.parse(prismaBoard.createdByUserId),
});

export const boardRepository = {
  save: async (board: BoardModel) => {
    await prismaClient.board.upsert({
      where: { id: board.id },
      update: {
        boardData: board.boardData,
        latestMove: board.latestMove,
        status: board.status,
        currentTurnUserId: board.currentTurnUserId,
      },
      create: {
        id: board.id,
        lobbyName: board.lobbyName,
        boardData: board.boardData,
        latestMove: board.latestMove,
        status: board.status,
        currentTurnUserId: board.currentTurnUserId,
        createdAt: new Date(board.created),
        createdByUserId: board.createdBy,
      },
    });
  },
  getAll: async (): Promise<BoardModel[]> => {
    // Get all lobby data
    const board = await prismaClient.board.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (!board) return [];

    return board.map(toModel);
  },
  getCurrent: async (lobbyId: string): Promise<BoardModel> => {
    const board = await prismaClient.board.findFirst({
      where: { id: lobbyId },
    });
    if (!board) throw new Error("Board doesn't exist");
    return toModel(board);
  },
  delete: async (lobbyId: string): Promise<void> => {
    await prismaClient.board.delete({
      where: { id: lobbyId },
    });
  },
};
