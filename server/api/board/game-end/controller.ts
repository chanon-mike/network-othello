import { boardRepository } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: { isGameEnd: boardRepository.isGameEnd() } }),
}));
