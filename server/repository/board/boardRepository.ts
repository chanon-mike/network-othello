import type { BoardModel } from '$/commonTypesWithClient/models';
import { UserIdParser, lobbyIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Board } from '@prisma/client';
import { z } from 'zod';

export type BoardArray = number[][];
export type Pos = { x: number; y: number };

const toModel = (prismaBoard: Board): BoardModel => ({
  id: lobbyIdParser.parse(prismaBoard.id),
  lobbyName: z.string().parse(prismaBoard.lobbyName),
  boardData: z.array(z.array(z.number())).parse(prismaBoard.boardData),
  latestMove: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .parse(prismaBoard.latestMove),
  isGameEnd: prismaBoard.isGameEnd,
  currentTurnUserId: UserIdParser.parse(prismaBoard.currentTurnUserId),
  created: prismaBoard.createdAt.getTime(),
});

export const boardRepository = {
  save: async (board: BoardModel) => {
    await prismaClient.board.upsert({
      where: { id: board.id },
      update: {
        boardData: board.boardData,
        latestMove: board.latestMove,
        isGameEnd: board.isGameEnd,
        currentTurnUserId: board.currentTurnUserId,
      },
      create: {
        id: board.id,
        boardData: board.boardData,
        latestMove: board.latestMove,
        isGameEnd: board.isGameEnd,
        currentTurnUserId: board.currentTurnUserId,
        createdAt: new Date(board.created),
      },
    });
  },
  getAll: async (): Promise<BoardModel[]> => {
    // Get all lobby data
    const board = await prismaClient.board.findMany({
      include: {
        playerList: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!board) return [];
    return board.map(toModel);
  },
  getCurrent: async (lobbyId: string): Promise<BoardModel> => {
    const board = await prismaClient.board.findFirst({
      where: { id: lobbyId },
      include: {
        playerList: true,
      },
    });
    if (!board) throw new Error("Board doesn't exist");
    return toModel(board);
  },
};
