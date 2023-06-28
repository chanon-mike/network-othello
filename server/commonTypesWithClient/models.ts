import type { BoardArray, Pos } from '$/repository/boardRepository';
import type { LobbyId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type BoardModel = {
  id: string;
  lobbyName: string;
  boardData: BoardArray;
  latestMove?: Pos;
  status: 'waiting' | 'playing' | 'ended';
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
