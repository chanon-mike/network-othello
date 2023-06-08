import type { LobbyModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: {
      lobby: LobbyModel[];
    };
  };

  post: {
    reqBody: {
      title: string;
    };
    resBody: {
      lobby: LobbyModel;
    };
  };
};
