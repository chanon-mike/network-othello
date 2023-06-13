import type { UserId } from '$/commonTypesWithClient/branded';
import type { BoardModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: BoardModel[];
  };
  post: {
    reqBody: {
      lobbyName: BoardModel['lobbyName'];
      userId: UserId;
    };
    resBody: BoardModel;
  };
};
