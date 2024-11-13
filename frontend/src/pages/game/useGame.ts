import { UserContext } from "@/contexts/user";
import { Pack } from "@/db/db";
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
};

type Hook = () => {
  users: User[];
  pack: Pack | null;
  id: string;
  isAdmin: boolean;
  isGameInProgress: boolean;
  isPaused: boolean;
  onSelect: (pack: Pack) => void;
  onStart: () => void;
  onAbort: () => void;
  onPause: () => void;
  onResume: () => void;
};

type Action =
  | {
      type: "init";
      payload: State;
    }
  | {
      type: "addUser";
      payload: User;
    }
  | {
      type: "deleteUser";
      payload: string;
    }
  | {
      type: "setId";
      payload: string;
    }
  | {
      type: "setPack";
      payload: Pack;
    };

const INITIAL_STATE: State = {
  id: "",
  users: [],
  pack: null,
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
        users: state.users.filter((user) => user.id !== payload),
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

  useEffect(() => {
    const socket = io({
      path: "/api/ws",
      query: {
        name: name ? name : "МЕССИ10",
        avatar: avatarID ? `https://i.imgur.com/${avatarID}.png` : null,
        roomId: params.id,
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

    const disconnectFromSocket = () => {
      socket.off("joinRoom", joinRoom);
      socket.off("userJoined", userJoined);
      socket.off("userDisconnected", userDisconnected);
      socket.off("setPack", setPack);
      socket.off("gameStarted", startGame);

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
  }) => {
    document.cookie = `userId=${args.userId}; max-age=86400; path=/;`;

    navigate(`/game/${args.roomId}`, {
      replace: true,
    });

    dispatch({
      type: "init",
      payload: {
        id: args.roomId,
        users: args.users,
        pack: args.pack,
      },
    });
    setIsAdmin(args.isAdmin);
    setIsGameInProgress(args.isGameInProgress);
    setIsPaused(args.isPaused);
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
    socket?.emit(
      "setPack",
      {
        name: pack.name,
        items: pack.items,
        type: pack.type,
      },
      game.id
    );
  };

  const onStart = () => {
    socket?.emit("startGame", game.id);
  };

  const onAbort = () => {
    socket?.emit("abortGame", game.id);
  };

  const onPause = () => {
    socket?.emit("pauseGame", game.id);
  };

  const onResume = () => {
    socket?.emit("resumeGame", game.id);
  };

  const startGame = () => {
    setIsGameInProgress(true);
  };

  const abortGame = () => {
    setIsGameInProgress(false);
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused(true);
  };

  const resumeGame = () => {
    setIsPaused(false);
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
  };
};
