import { boardRepository } from '$/repository/boardRepository';
import { boardUseCase } from '$/usecase/board/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: await boardRepository.getCurrent(lobbyId),
  }),
  put: async ({ body, params: { lobbyId }, user }) => ({
    status: 200,
    body: { board: await boardUseCase.clickBoard(lobbyId, body, user.id) },
  }),
}));
