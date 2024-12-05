import { UserContext } from "@/contexts/user";
import { Pack, PackItem } from "@/db/db";
import { getCook } from "@/utils/getCook";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { voteType } from "./useControls";

export type User = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isObserver: boolean;
  score: number;
  isVoted: boolean | null;
};

type endGameNotification = {
  isSpyWon: boolean;
  card: PackItem;
  spy: User;
};

type Voting = {
  isVoting: boolean;
  isVoted: boolean | null;
  targetId: string | null;
  userId: string | null;
  votingStartTime: number | null;
  terminate: (() => void) | null;
};

type State = {
  id: string;
  users: User[];
  pack: Pack | null;
  card: PackItem | null;
  isSpy: boolean;
};

type Hook = (onCancelVoting: () => void) => {
  isLoading: boolean;
  users: User[];
  pack: Pack | null;
  id: string;
  isSpy: boolean;
  card: PackItem | null;
  isAdmin: boolean;
  isGameInProgress: boolean;
  isPaused: boolean;
  onSelect: (pack: Pack) => void;
  onStart: () => void;
  onAbort: () => void;
  onPause: () => void;
  onResume: () => void;
  onStartVote: (type: voteType, id: string) => void;
  time: number;
  setTime: (time: number) => void;
  endGameNotification: endGameNotification | null;
  onCloseNotification: () => void;
  voting: Voting;
  onSubmitVote: (userId: string, vote: boolean) => void;
  userId: string;
};

type Action =
  | {
      type: "init";
      payload: State;
    }
  | {
      type: "addUser" | "reconnectUser" | "disconnectUser";
      payload: User;
    }
  | {
      type: "updateUsers";
      payload: User[];
    }
  | {
      type: "deleteUser" | "setId";
      payload: string;
    }
  | {
      type: "setPack";
      payload: Pack;
    }
  | {
      type: "setCard";
      payload: PackItem | null;
    }
  | {
      type: "setIsSpy";
      payload: boolean;
    }
  | {
      type: "setUserVoted";
      payload: { id: string; voted: boolean };
    }
  | {
      type: "setVotingEnded";
      payload: null;
    };

const INITIAL_STATE: State = {
  id: "",
  users: [],
  pack: null,
  isSpy: false,
  card: null,
};

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "init":
      return {
        ...payload,
      };
    case "setId":
      return {
        ...state,
        id: payload,
      };
    case "setPack":
      return {
        ...state,
        pack: payload,
      };
    case "addUser":
      return { ...state, users: [...state.users, payload] };
    case "deleteUser":
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== payload),
      };
    case "reconnectUser":
    case "disconnectUser":
      state.users[
        state.users.findIndex(({ id }) => id === payload.id)
      ].isOnline = payload.isOnline;

      return {
        ...state,
      };
    case "updateUsers":
      return {
        ...state,
        users: payload,
      };
    case "setCard":
      return {
        ...state,
        card: payload,
      };
    case "setIsSpy":
      return {
        ...state,
        isSpy: payload,
      };
    case "setUserVoted":
      state.users[
        state.users.findIndex(({ id }) => id === payload.id)
      ].isVoted = payload.voted;

      return {
        ...state,
      };
    case "setVotingEnded":
      state.users.forEach((user) => (user.isVoted = null));

      return {
        ...state,
      };
    default: {
      return state;
    }
  }
};

export const useGame: Hook = (onCancelVoting) => {
  const { name, avatarID } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [game, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [showEndGame, setShowEndGame] = useState<endGameNotification | null>(
    null
  );
  const [voting, setVoting] = useState<Voting>({
    isVoting: false,
    isVoted: null,
    targetId: null,
    userId: null,
    terminate: null,
    votingStartTime: null,
  });

  useEffect(() => {
    const userId = getCook("userId");

    if (userId) setUserId(userId);

    const socket = io({
      path: "/api/ws",
      query: {
        name: name ? name : "МЕССИ10",
        avatar: avatarID ? avatarID : null,
        roomId: params.id?.toUpperCase(),
        userId: userId,
      },
    });

    setSocket(socket);

    socket.on("joinRoom", joinRoom);
    socket.on("userJoined", userJoined);
    socket.on("userDisconnected", userDisconnected);
    socket.on("setPack", setPack);
    socket.on("gameStarted", startGame);
    socket.on("gameAborted", abortGame);
    socket.on("gamePaused", pauseGame);
    socket.on("gameResumed", resumeGame);
    socket.on("userReconnected", userReconnected);
    socket.on("userLostConnection", userLostConnection);
    socket.on("endGame", endGame);
    socket.on("voteInitiated", voteInitiated);
    socket.on("userVoted", userVoted);
    socket.on("votingEnded", votingEnded);

    const disconnectFromSocket = () => {
      socket.off("joinRoom", joinRoom);
      socket.off("userJoined", userJoined);
      socket.off("userDisconnected", userDisconnected);
      socket.off("setPack", setPack);
      socket.off("gameStarted", startGame);
      socket.off("gameAborted", abortGame);
      socket.off("gamePaused", pauseGame);
      socket.off("gameResumed", resumeGame);
      socket.off("userReconnected", userReconnected);
      socket.off("userLostConnection", userLostConnection);
      socket.off("endGame", endGame);
      socket.off("voteInitiated", voteInitiated);
      socket.off("userVoted", userVoted);
      socket.off("votingEnded", votingEnded);

      socket.close();
    };

    window.addEventListener("beforeunload", disconnectFromSocket);

    return () => {
      disconnectFromSocket();
      window.removeEventListener("beforeunload", disconnectFromSocket);
    };
  }, []);

  const joinRoom = (args: {
    userId: string;
    roomId: string;
    users: User[];
    pack: Pack | null;
    isAdmin: boolean;
    isGameInProgress: boolean;
    isPaused: boolean;
    isReconnect: boolean;
    timeLeft: number;
    isSpy: boolean;
    card: PackItem | null;
    voting: Voting;
  }) => {
    if (!args.isReconnect) {
      document.cookie = `userId=${args.userId}; max-age=86400; path=/;`;

      setUserId(args.userId);
    }

    navigate(`/game/${args.roomId}`, {
      replace: true,
    });

    dispatch({
      type: "init",
      payload: {
        id: args.roomId,
        users: args.users,
        pack: args.pack,
        card: args.card,
        isSpy: args.isSpy,
      },
    });

    setIsAdmin(args.isAdmin);
    setIsGameInProgress(args.isGameInProgress);
    setIsPaused(args.isPaused);
    setTimeLeft(args.timeLeft);
    setVoting({
      ...args.voting,
      terminate: terminateVoting,
    });

    setIsLoading(false);
  };

  const userJoined = (args: User) => {
    dispatch({ type: "addUser", payload: args });
  };

  const userDisconnected = (id: string) => {
    dispatch({ type: "deleteUser", payload: id });
  };

  const setPack = (args: Pack) => {
    dispatch({ type: "setPack", payload: args });
  };

  const onSelect = (pack: Pack) => {
    if (isGameInProgress) return;

    socket?.emit(
      "setPack",
      {
        name: pack.name,
        items: pack.items,
        type: pack.type,
      },
      game.id,
      userId
    );
  };

  const onStart = () => {
    if (!game.pack) return;

    socket?.emit("startGame", game.id, userId);
  };

  const onAbort = () => {
    socket?.emit("abortGame", game.id, userId);
  };

  const onPause = () => {
    socket?.emit("pauseGame", game.id, userId);
  };

  const onResume = () => {
    socket?.emit("resumeGame", game.id, userId);
  };

  const onStartVote = (type: voteType, id: string) => {
    if (!type) return;

    socket?.emit("startVote", type, game.id, userId, id);
    onCancelVoting();
  };

  const startGame = (args: { isSpy: boolean; card: PackItem }) => {
    setIsGameInProgress(true);
    setShowEndGame(null);

    dispatch({ type: "setIsSpy", payload: args.isSpy });
    dispatch({ type: "setCard", payload: args.card });
  };

  const abortGame = (users: User[]) => {
    setIsGameInProgress(false);
    setIsPaused(false);
    dispatch({ type: "updateUsers", payload: users });

    setTimeLeft(600);
    onCancelVoting();
    setVoting({
      isVoting: false,
      isVoted: null,
      targetId: null,
      userId: null,
      terminate: null,
      votingStartTime: null,
    });
  };

  const pauseGame = () => {
    setIsPaused(true);
  };

  const resumeGame = () => {
    setIsPaused(false);
  };

  const userReconnected = (user: User) => {
    dispatch({ type: "reconnectUser", payload: user });
  };

  const userLostConnection = (user: User) => {
    dispatch({ type: "disconnectUser", payload: user });
  };

  const setTime = (time: number) => {
    setTimeLeft(time);
  };

  const voteInitiated = (userId: string, targetId: string) => {
    pauseGame();

    dispatch({ type: "setUserVoted", payload: { voted: true, id: userId } });
    dispatch({ type: "setUserVoted", payload: { voted: false, id: targetId } });

    const id = getCook("userId");

    setVoting({
      isVoting: true,
      isVoted: userId === id || (targetId === id ? false : null),
      targetId,
      userId,
      votingStartTime: null,
      terminate: terminateVoting,
    });
  };

  const onSubmitVote = (userId: string, vote: boolean) => {
    setVoting((val) => {
      return { ...val, isVoted: true };
    });

    socket?.emit("submitVote", game.id, userId, vote);
  };

  const userVoted = (userId: string, vote: boolean) => {
    dispatch({ type: "setUserVoted", payload: { id: userId, voted: vote } });
  };

  const endGame = (
    isSpyWon: boolean,
    scoredUsers: User[],
    spy: User,
    card: PackItem
  ) => {
    abortGame(scoredUsers);

    setShowEndGame({
      isSpyWon,
      card,
      spy,
    });
  };

  const votingEnded = () => {
    resumeGame();

    dispatch({ type: "setVotingEnded", payload: null });
    setVoting({
      isVoting: false,
      targetId: null,
      userId: null,
      isVoted: null,
      terminate: null,
      votingStartTime: null,
    });
  };

  const onCloseNotification = () => {
    setShowEndGame(null);
  };

  const terminateVoting = () =>
    setVoting({
      isVoting: false,
      targetId: null,
      userId: null,
      isVoted: null,
      terminate: null,
      votingStartTime: null,
    });

  return {
    isLoading,
    ...game,
    isAdmin,
    isGameInProgress,
    isPaused,
    onSelect,
    onStart,
    onAbort,
    onPause,
    onResume,
    onStartVote,
    setTime,
    time: timeLeft,
    endGameNotification: showEndGame,
    onCloseNotification,
    voting,
    onSubmitVote,
    userId,
  };
};
