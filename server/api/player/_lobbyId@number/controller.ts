import { createPlayer, getCurrentPlayerInLobby } from '$/repository/playerRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: { player: await getCurrentPlayerInLobby(lobbyId) },
  }),
  post: async ({ params: { lobbyId }, user }) => ({
    status: 201,
    body: { player: await createPlayer(lobbyId, user) },
  }),
}));
