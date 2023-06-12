import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel, PlayerModel, UserModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Board, Player } from '@prisma/client';
import { getValidMoves } from './board/boardRepository';

export type UserColorDict = { black?: UserId; white?: UserId };
export type PlayerTurn = UserId | undefined;

const toModel = (prismaPlayer: Player): PlayerModel => ({
  id: prismaPlayer.id,
  lobbyId: prismaPlayer.lobbyId,
  boardId: prismaPlayer.boardId,
  userId: prismaPlayer.userId as UserId,
  displayName: prismaPlayer.displayName,
  color: prismaPlayer.color,
  score: prismaPlayer.score,
  created: prismaPlayer.createdAt.getTime(),
});

export const getCurrentPlayerInLobby = async (
  lobbyId: PlayerModel['lobbyId']
): Promise<PlayerModel[]> => {
  // Get current player that in the lobby of lobbyId
  const prismaPlayer = await prismaClient.player.findMany({
    where: {
      lobbyId,
    },
  });
  return prismaPlayer.map(toModel);
};

export const createPlayer = async (
  lobbyId: PlayerModel['lobbyId'],
  user: UserModel
): Promise<PlayerModel> => {
  const existingPlayer = await prismaClient.player.findUnique({
    where: {
      userId: user.id,
    },
  });
  // userId already exists, return existed player
  if (existingPlayer) return toModel(existingPlayer);

  // Retrieve Player and Board from the lobby
  const lobby = await prismaClient.lobby.findUnique({
    where: {
      id: lobbyId,
    },
    include: {
      Board: true,
      Player: true,
    },
  });
  // Set a color of player to 1 if no one in lobby, else 2
  const color = lobby && lobby.Player.length === 0 ? 1 : 2;

  // Create a player linked to a lobby id
  const prismaPlayer = await prismaClient.player.create({
    data: {
      userId: user.id,
      displayName: user.displayName ?? user.id,
      color,
      lobby: {
        connect: {
          id: lobbyId,
        },
      },
      board: {
        connect: {
          id: lobby?.Board?.id,
        },
      },
    },
  });
  return toModel(prismaPlayer);
};

export const switchTurn = async (lobbyId: PlayerModel['id']): Promise<PlayerTurn> => {
  // Fetch player in this lobby with board info
  const prismaPlayer = await prismaClient.player.findMany({
    where: { lobbyId },
    include: {
      board: true,
    },
  });
  if (!prismaPlayer) throw new Error("User doesn't exist");

  // Switch to opponent turn if valid
  const currentPlayerTurn: PlayerTurn = await switchTurnValidation(lobbyId, prismaPlayer);
  await prismaClient.board.update({
    where: { lobbyId },
    data: { currentTurnUserId: currentPlayerTurn },
  });

  return currentPlayerTurn;
};

export const getCurrentTurn = async (lobbyId: BoardModel['id']): Promise<PlayerTurn> => {
  // Get current turn of the boardId, if undefined, set it to the first player userId
  const prismaPlayer = await prismaClient.player.findMany({
    where: { lobbyId },
    include: { board: true },
  });
  let currentTurnUserId = prismaPlayer[0].board.currentTurnUserId as PlayerTurn;
  if (prismaPlayer && (!currentTurnUserId || currentTurnUserId === undefined)) {
    currentTurnUserId = prismaPlayer[0].userId as PlayerTurn;
  }
  return currentTurnUserId;
};

export const getUserColorDict = async (lobbyId: PlayerModel['lobbyId']): Promise<UserColorDict> => {
  // Assign each userId to the color
  const prismaPlayer = await prismaClient.player.findMany({
    where: { lobbyId },
    include: {
      board: true,
    },
  });
  if (!prismaPlayer) throw new Error("User doesn't exist");

  const userColorDict: UserColorDict = {};
  prismaPlayer.forEach((player) => {
    if (player.color === 1) userColorDict.black = player.userId as UserId;
    else if (player.color === 2) userColorDict.white = player.userId as UserId;
  });
  return userColorDict;
};

const switchTurnValidation = async (
  lobbyId: PlayerModel['lobbyId'],
  prismaPlayer: (Player & {
    board: Board;
  })[]
): Promise<PlayerTurn> => {
  const userColorDict = await getUserColorDict(lobbyId);
  const blackUserId = userColorDict.black;
  const whiteUserId = userColorDict.white;
  // If current player can move and opponent can move too, switch to opponent turn and set to opponent turn
  let currentPlayerTurn: PlayerTurn = prismaPlayer[0].board.currentTurnUserId as PlayerTurn;

  // Next turn is white turn if it the first turn (BUG)
  if (currentPlayerTurn === null) return blackUserId;

  const opponentPlayerTurn: PlayerTurn =
    currentPlayerTurn === blackUserId ? whiteUserId : blackUserId;

  // If opponent can move, pass turn to opponent
  // If opponent can't move, your turn
  if (opponentPlayerTurn && (await getValidMoves(lobbyId, opponentPlayerTurn)).length) {
    currentPlayerTurn = opponentPlayerTurn;
  }

  return currentPlayerTurn;
};
