import { getValidMoves } from '$/repository/board/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId }, user }) => ({
    status: 200,
    body: await getValidMoves(lobbyId, user.id),
  }),
}));
