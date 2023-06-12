import { getScore } from '$/repository/scoreRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({ status: 200, body: await getScore(lobbyId) }),
}));
