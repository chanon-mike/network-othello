import type { UserModel } from '$/commonTypesWithClient/models';
import type { BoardArray } from '$/repository/boardRepository';

export type Methods = {
  get: {
    resBody: {
      board: BoardArray;
    };
  };

  post: {
    reqBody: {
      x: number;
      y: number;
      user: UserModel;
    };
    resBody: {
      board: BoardArray;
    };
  };
};
