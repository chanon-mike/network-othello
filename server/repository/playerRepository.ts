import type { UserId } from '$/commonTypesWithClient/branded';

export type ColorDict = { black?: UserId; white?: UserId };

const userColorDict: ColorDict = {};
let currentPlayer: UserId | undefined = undefined;

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
  getCurrentPlayer: (): UserId | undefined => {
    // First move
    if (currentPlayer === undefined) currentPlayer = userColorDict.black;
    return currentPlayer;
  },
  setCurrentPlayer: (userId: UserId | undefined): void => {
    // Set the current turn to player id
    currentPlayer = userId;
  },
  switchTurn: (): UserId | undefined => {
    // Switch turn (black to white, white to black)
    if (currentPlayer === userColorDict.black) {
      currentPlayer = userColorDict.white;
    } else {
      currentPlayer = userColorDict.black;
    }
    return currentPlayer;
  },
};
