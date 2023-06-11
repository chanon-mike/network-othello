import { clickBoard, createBoard, getBoard } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: { board: await getBoard(lobbyId) },
  }),
  post: async ({ params: { lobbyId } }) => ({
    status: 201,
    body: { board: await createBoard(lobbyId) },
  }),
  put: async ({ body, params: { lobbyId }, user }) => ({ status: 204, body: { board: await clickBoard(lobbyId, body, user.id) } }),
}));
