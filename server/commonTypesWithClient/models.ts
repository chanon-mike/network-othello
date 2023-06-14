import type { BoardArray, Pos } from '$/repository/boardRepository';
import type { LobbyId, TaskId, UserId } from './branded';

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

export type BoardModel = {
  id: string;
  lobbyName: string;
  boardData: BoardArray;
  latestMove?: Pos;
  isGameEnd: boolean;
  currentTurnUserId: UserId;
  created: number;
};

export type PlayerModel = {
  userId: UserId;
  lobbyId: LobbyId;
  in: number;
  out?: number;
  color: number;
  score: number;
};
