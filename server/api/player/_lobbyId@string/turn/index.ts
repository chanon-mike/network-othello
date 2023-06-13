import type { PlayerTurn } from '$/repository/playerRepository';

export type Methods = {
  get: {
    resBody: {
      currentTurnUserId: PlayerTurn;
    };
  };
};
