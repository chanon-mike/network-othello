import { playerRepository } from '$/repository/playerRepository';
import { playerUseCase } from '$/usecase/playerUseCase';

import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ params: { lobbyId } }) => ({
    status: 200,
    body: { player: await playerRepository.getAllInLobby(lobbyId) },
  }),
  post: async ({ params: { lobbyId }, user }) => ({
    status: 201,
    body: { player: await playerUseCase.createPlayer(lobbyId, user.id) },
  }),
  delete: async ({ params: { lobbyId }, user }) => ({
    status: 200,
    body: { player: await playerRepository.delete(lobbyId, user.id) },
  }),
}));
