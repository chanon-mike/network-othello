import { boardUseCase } from '$/usecase/board/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId }, user }) => ({
    status: 200,
    body: await boardUseCase.getValidMoves(lobbyId, user.id),
  }),
}));
