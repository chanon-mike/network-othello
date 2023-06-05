import { boardRepository } from '$/repository/boardRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  post: ({ body, user }) => ({
    status: 201,
    body: { board: boardRepository.flipDisc(body, user.id) },
  }),
}));
