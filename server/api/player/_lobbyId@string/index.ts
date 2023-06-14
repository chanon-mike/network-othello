import type { PlayerModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: {
      player: PlayerModel[];
    };
  };

  post: {
    resBody: {
      player: PlayerModel;
    };
  };

  delete: {
    resBody: {
      player: PlayerModel;
    };
  };
};
