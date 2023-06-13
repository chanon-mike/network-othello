import { boardUseCase } from '$/usecase/board/boardUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  put: async ({ params: { lobbyId } }) => {
    await boardUseCase.resetBoard(lobbyId);
    return { status: 204 };
  },
}));
