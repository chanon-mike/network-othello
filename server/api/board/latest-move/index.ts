import type { Pos } from '$/repository/boardRepository';

export type Methods = {
  get: {
    resBody: {
      latestMove: Pos;
    };
  };
};
