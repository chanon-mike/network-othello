import { boardRepository, createBoard } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: { board: boardRepository.getBoard() } }),
  // post: ({ body, user }) => ({
  //   status: 201,
  //   body: { board: boardRepository.clickBoard(body, user.id) },
  // }),
  post: async ({ query }) => ({ status: 201, body: { board: await createBoard(query.lobbyId) } }),
}));
