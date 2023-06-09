import type { UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Player } from '@prisma/client';
import { boardRepository } from './boardRepository';

export type UserColorDict = { black?: UserId; white?: UserId };
export type PlayerTurn = UserId | undefined;

const userColorDict: UserColorDict = {};
let currentPlayer: PlayerTurn = undefined;

const toModel = (prismaPlayer: Player | null): PlayerModel => ({
  id: prismaPlayer?.id,
  lobbyId: prismaPlayer?.lobbyId,
  userId: prismaPlayer?.userId,
  displayName: prismaPlayer?.displayName,
  color: prismaPlayer?.color,
  created: prismaPlayer?.createdAt.getTime(),
});

export const getCurrentPlayerInLobby = async (
  lobbyId: PlayerModel['lobbyId']
): Promise<PlayerModel[]> => {
  const prismaPlayer = await prismaClient.player.findMany({
    where: {
      lobbyId,
    },
  });

  return prismaPlayer.map(toModel);
};

export const playerRepository = {
  getUserColor: (userId: UserId): number => {
    if (userColorDict.black === userId) {
      return 1;
    } else if (userColorDict.white === userId) {
      return 2;
    } else if (userColorDict.black === undefined) {
      userColorDict.black = userId;
      return 1;
    } else {
      userColorDict.white = userId;
      return 2;
    }
  },
  getCurrentPlayer: (): PlayerTurn => {
    // Get current turn, for first move, black start first
    if (currentPlayer === undefined) currentPlayer = userColorDict.black;
    return currentPlayer;
  },
  setCurrentPlayer: (userId: PlayerTurn): void => {
    // Set the current turn to player id
    currentPlayer = userId;
  },
  getUserColorDict: (): UserColorDict => {
    return userColorDict;
  },
  switchPlayerTurnWithValidation: (): PlayerTurn => {
    // If current player can move and opponent can move too, switch to opponent turn and set to opponent turn
    const opponentPlayer: PlayerTurn = switchTurn();
    if (opponentPlayer && boardRepository.getValidMoves(opponentPlayer).length) {
      currentPlayer = opponentPlayer;
    }

    return currentPlayer;
  },
};

// Helper function to switch player turn in dict
const switchTurn = (): PlayerTurn => {
  // Switch turn (black to white, white to black)
  return currentPlayer === userColorDict.black ? userColorDict.white : userColorDict.black;
};
