import { resetBoard } from '$/repository/board/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  put: async ({ params: { lobbyId } }) => ({ status: 204, body: await resetBoard(lobbyId) }),
}));
