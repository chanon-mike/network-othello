import { z } from 'zod';
import type { LobbyId, TaskId, UserId } from '../commonTypesWithClient/branded';

export const UserIdParser: z.ZodType<UserId> = z.string().brand<'UserId'>();

export const taskIdParser: z.ZodType<TaskId> = z.string().brand<'TaskId'>();

export const lobbyIdParser: z.ZodType<LobbyId> = z.string().brand<'LobbyId'>();
