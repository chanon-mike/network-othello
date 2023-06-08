import type { LobbyModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Lobby } from '@prisma/client';

const toModel = (prismaLobby: Lobby): LobbyModel => ({
  id: prismaLobby.id,
  title: prismaLobby.title,
  created: prismaLobby.createdAt.getTime(),
  updated: prismaLobby.updatedAt.getTime(),
});

export const getAllLobby = async (): Promise<LobbyModel[]> => {
  // Get all lobby data
  const prismaLobby = await prismaClient.lobby.findMany({
    include: {
      Player: true,
    },
  });

  return prismaLobby.map(toModel);
};

export const createLobby = async (title: LobbyModel['title']): Promise<LobbyModel> => {
  const newLobby = {
    data: {
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  const prismaLobby = await prismaClient.lobby.create(newLobby);

  console.log(title, prismaLobby);

  return toModel(prismaLobby);
};
