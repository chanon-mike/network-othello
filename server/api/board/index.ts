import type { BoardModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: BoardModel[];
  };
  post: {
    reqBody: {
      lobbyName: BoardModel['lobbyName'];
    };
    resBody: BoardModel;
  };
};
