import { UserContext } from "@/contexts/user";
import { Pack, PackItem } from "@/db/db";
import { getCook } from "@/utils/getCook";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

type User = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
};

type State = {
  id: string;
  users: User[];
  pack: Pack | null;
  card: PackItem | null;
  isSpy: boolean;
};

type Hook = () => {
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
  time: number;
  setTime: (time: number) => void;
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
    default: {
      return state;
    }
  }
};

export const useGame: Hook = () => {
  const { name, avatarID } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const [game, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600);

  useEffect(() => {
    const userId = getCook("userId");

    if (userId) setUserId(userId);

    const socket = io({
      path: "/api/ws",
      query: {
        name: name ? name : "МЕССИ10",
        avatar: avatarID ? `https://i.imgur.com/${avatarID}.png` : null,
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

  const startGame = (args: { isSpy: boolean; card: PackItem }) => {
    setIsGameInProgress(true);

    dispatch({ type: "setIsSpy", payload: args.isSpy });
    dispatch({ type: "setCard", payload: args.card });
  };

  const abortGame = (users: User[]) => {
    setIsGameInProgress(false);
    setIsPaused(false);
    dispatch({ type: "updateUsers", payload: users });

    setTimeLeft(600);
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

  return {
    ...game,
    isAdmin,
    isGameInProgress,
    isPaused,
    onSelect,
    onStart,
    onAbort,
    onPause,
    onResume,
    setTime,
    time: timeLeft,
  };
};
