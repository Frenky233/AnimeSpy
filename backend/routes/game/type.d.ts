import type { Pack } from "../../../frontend/src/db/db";

export type Room = {
  id: string;
  pack: ServerPack | null;
  users: User[];
  spy: string | null;
  host: string;
  isGameInProgress: boolean;
};

export type User = {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  isObserver: boolean;
  isVoted: boolean | null;
  score: number;
};

export type Voting = {
  isVoting: boolean;
  votingStartTime: number | null;
  isVoted: boolean | null;
  targetId: string | null;
  userId: string | null;
};

export type ServerPack = Omit<Pack, "id">;
