import { scoreRepository } from '$/repository/scoreRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: scoreRepository.getScore() }),
}));
