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

  put: {
    reqBody: {
      x: number;
      y: number;
    };
    resBody: {
      board: BoardModel;
    };
  };
};
