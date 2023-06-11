import { getCurrentTurn } from '$/repository/playerRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: { currentTurnUserId: await getCurrentTurn(lobbyId) },
  }),
}));
