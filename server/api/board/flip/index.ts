import type { BoardArray } from '$/repository/boardRepository';

export type Methods = {
  post: {
    reqBody: {
      x: number;
      y: number;
    };
    resBody: {
      board: BoardArray;
    };
  };
};
