import type { BoardArray, Pos } from '$/repository/boardRepository';
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
  playerNum?: number;
  Player?: PlayerModel;
};

export type PlayerModel = {
  id: number;
  lobbyId: number;
  userId: UserId;
  displayName: string;
  color: number;
  created: number;
};

export type BoardModel = {
  id: number;
  lobbyId: number;
  boardData: BoardArray;
  latestMove: Pos;
  isGameEnd: boolean;
  currentTurnPlayerId: UserId;
  created: number;
  updated: number;
};
