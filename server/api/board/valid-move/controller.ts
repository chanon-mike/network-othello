import { boardRepository } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ user }) => ({ status: 200, body: boardRepository.getValidMoves(user.id) }),
}));
