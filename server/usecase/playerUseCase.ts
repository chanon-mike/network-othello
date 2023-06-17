import type { UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { boardRepository } from '$/repository/boardRepository';
import type { Score, UserColorDict } from '$/repository/playerRepository';
import { playerRepository } from '$/repository/playerRepository';
import { lobbyIdParser } from '$/service/idParsers';
import { boardUseCase } from './board/boardUseCase';

export const playerUseCase = {
  createPlayer: async (lobbyId: string, userId: UserId): Promise<PlayerModel> => {
    // Set a color of player to 1 if no one in lobby, else 2
    const playerList = await playerRepository.getAllInLobby(lobbyId);
    const color = playerList.length === 0 ? 1 : playerList[0].color === 1 ? 2 : 1;

    if (playerList.length === 2) {
      throw new Error('There are already two player in the lobby');
    }

    // Create a new player
    const newPlayer = {
      userId,
      lobbyId: lobbyIdParser.parse(lobbyId),
      in: Date.now(),
      color,
      score: 2,
    };
    await playerRepository.save(newPlayer);

    // Change game status to playing after 2 player joined
    const updatedPlayerList = await playerRepository.getAllInLobby(lobbyId);
    if (updatedPlayerList.length === 2) {
      await boardUseCase.changeStatus(lobbyId);
    }

    return newPlayer;
  },
  getAllPlayerTurn: async (lobbyId: string): Promise<UserColorDict> => {
    const playerList = await playerRepository.getAllInLobby(lobbyId);
    const userColorDict: UserColorDict = {};

    playerList.length === 2 &&
      playerList.forEach((player) => {
        if (player.color === 1) userColorDict.black = player;
        else if (player.color === 2) userColorDict.white = player;
      });
    return userColorDict;
  },
  switchTurn: async (lobbyId: string, currentTurnUserId: UserId): Promise<UserId> => {
    const userColorDict = await playerUseCase.getAllPlayerTurn(lobbyId);
    const blackPlayer = userColorDict.black;
    const whitePlayer = userColorDict.white;
    console.log(userColorDict);

    if (blackPlayer && whitePlayer) {
      const opponentPlayerTurn: UserId =
        currentTurnUserId === blackPlayer.userId ? whitePlayer.userId : blackPlayer.userId;

      // If opponent can move, pass turn to opponent
      // If opponent can't move, your turn
      if ((await boardUseCase.getValidMoves(lobbyId, opponentPlayerTurn)).length)
        currentTurnUserId = opponentPlayerTurn;
    }

    return currentTurnUserId;
  },
  setScore: async (lobbyId: string): Promise<void> => {
    // Retrieve the user color dictionary for the given lobbyId
    const userColorDict: UserColorDict = await playerUseCase.getAllPlayerTurn(lobbyId);
    const { blackScore, whiteScore } = await playerUseCase.calculateScore(lobbyId);

    if (userColorDict.black && userColorDict.white) {
      // Update black and white player score
      const blackPlayer: PlayerModel = {
        userId: userColorDict.black.userId,
        lobbyId: userColorDict.black.lobbyId,
        in: userColorDict.black.in,
        color: userColorDict.black.color,
        score: blackScore,
      };
      const whitePlayer: PlayerModel = {
        userId: userColorDict.white.userId,
        lobbyId: userColorDict.white.lobbyId,
        in: userColorDict.white.in,
        color: userColorDict.white.color,
        score: whiteScore,
      };

      await playerRepository.save(blackPlayer);
      await playerRepository.save(whitePlayer);
    }
  },
  calculateScore: async (lobbyId: string): Promise<Score> => {
    // Retrieve the board data for the given lobbyId
    const prismaBoard = await boardRepository.getCurrent(lobbyId);
    const boardData = prismaBoard.boardData;
    let blackScore = 0;
    let whiteScore = 0;

    // Calculate the scores based on the values in the board data
    boardData.forEach((row, y) =>
      row.forEach((_, x) => {
        if (boardData[y][x] === 1) {
          blackScore += 1;
        } else if (boardData[y][x] === 2) {
          whiteScore += 1;
        }
      })
    );

    return { blackScore, whiteScore };
  },
};
