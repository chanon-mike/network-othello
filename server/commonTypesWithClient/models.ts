import type { TaskId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type TaskModel = {
  id: TaskId;
  label: string;
  done: boolean;
  created: number;
};

export type LobbyModel = {
  id: number;
  title: string;
  created: number;
  updated: number;
};

export type PlayerModel = {
  id: number | undefined;
  lobbyId: number | undefined;
  userId: string | undefined;
  displayName: string | undefined;
  color: number | undefined;
  created: number | undefined;
};
