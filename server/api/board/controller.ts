import { boardRepository } from '$/repository/boardRepository';
import { boardUseCase } from '$/usecase/board/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: await boardRepository.getAll(),
  }),
  post: async ({ body, user }) => ({
    status: 201,
    body: await boardUseCase.create(body.lobbyName, user.id),
  }),
}));
