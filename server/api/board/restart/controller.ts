import { boardRepository } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  put: () => ({ status: 200, body: boardRepository.restart() }),
}));
