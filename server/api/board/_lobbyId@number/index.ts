import type { BoardModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: {
      board: BoardModel;
    };
  };

  post: {
    resBody: {
      board: BoardModel;
    };
  };
};
