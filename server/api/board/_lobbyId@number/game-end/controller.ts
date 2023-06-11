import { isGameEnd } from '$/repository/board/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: { isGameEnd: await isGameEnd(lobbyId) },
  }),
}));
