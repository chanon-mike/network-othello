import type { BoardModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: BoardModel;
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
