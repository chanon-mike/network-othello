import type { UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { UserIdParser, lobbyIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { Player } from '@prisma/client';

export type UserColorDict = { black?: PlayerModel; white?: PlayerModel };
export type PlayerTurn = UserId | undefined;
export type Score = { blackScore: number; whiteScore: number };

const toModel = (prismaPlayer: Player): PlayerModel => ({
  userId: UserIdParser.parse(prismaPlayer.userId),
  lobbyId: lobbyIdParser.parse(prismaPlayer.lobbyId),
  in: prismaPlayer.in.getTime(),
  out: prismaPlayer.out?.getTime(),
  color: prismaPlayer.color,
  score: prismaPlayer.score,
});

export const playerRepository = {
  save: async (player: PlayerModel) => {
    await prismaClient.player.upsert({
      where: { userId_lobbyId: { userId: player.userId, lobbyId: player.lobbyId } },
      update: {
        score: player.score,
      },
      create: {
        userId: player.userId,
        lobbyId: player.lobbyId,
        in: new Date(player.in),
        color: player.color,
        score: player.score,
      },
    });
  },
  getAllInLobby: async (lobbyId: string): Promise<PlayerModel[]> => {
    const player = await prismaClient.player.findMany({
      where: { lobbyId },
    });
    return player.map(toModel);
  },
  getByUserId: async (lobbyId: string, userId: UserId): Promise<PlayerModel> => {
    const player = await prismaClient.player.findFirst({
      where: { userId, lobbyId },
    });
    if (!player) throw new Error("Player doesn't exist");
    return toModel(player);
  },
  delete: async (lobbyId: string, userId: UserId): Promise<PlayerModel> => {
    const deletePlayer = await prismaClient.player.delete({
      where: {
        userId_lobbyId: {
          userId,
          lobbyId,
        },
      },
    });
    if (!deletePlayer) throw new Error("Player doesn't exist");
    return toModel(deletePlayer);
  },
};
