import { playerRepository } from '$/repository/playerRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ user }) => ({
    status: 200,
    body: { currentPlayerColor: playerRepository.getUserColor(user.id) },
  }),
}));
