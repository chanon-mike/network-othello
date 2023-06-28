import { z } from 'zod';
import type { LobbyId, UserId } from '../commonTypesWithClient/branded';

export const UserIdParser: z.ZodType<UserId> = z.string().brand<'UserId'>();

export const lobbyIdParser: z.ZodType<LobbyId> = z.string().brand<'LobbyId'>();
