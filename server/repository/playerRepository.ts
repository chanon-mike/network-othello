import type { UserId } from '$/commonTypesWithClient/branded';

export type UserColorDict = { black?: UserId; white?: UserId };
export type PlayerTurn = UserId | undefined;

const userColorDict: UserColorDict = {};
let currentPlayer: PlayerTurn = undefined;

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
  switchTurn: (): PlayerTurn => {
    // Switch turn (black to white, white to black)
    if (currentPlayer === userColorDict.black) {
      currentPlayer = userColorDict.white;
    } else {
      currentPlayer = userColorDict.black;
    }
    return currentPlayer;
  },
  getUserColorDict: (): UserColorDict => {
    return userColorDict;
  },
};
