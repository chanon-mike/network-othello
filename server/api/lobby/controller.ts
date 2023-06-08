import { createLobby, getAllLobby } from '$/repository/lobbyRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: { lobby: await getAllLobby() } }),
  post: async ({ body }) => ({ status: 201, body: { lobby: await createLobby(body.title) } }),
}));
