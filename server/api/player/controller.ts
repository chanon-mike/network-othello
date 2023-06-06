import { playerRepository } from '$/repository/playerRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: { currentPlayerId: playerRepository.getCurrentPlayer() },
  }),
}));
