import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { createMiddleware } from "hono/factory";
import { v4 as uuidv4 } from "uuid";
import type { ServerPack, User } from "./type";
import redisClient from "../../db/db";

let io: Server | null;

export function initWebsocket(server: any) {
  io = new Server(server as HttpServer, {
    path: "/api/ws",
    serveClient: false,
  });

  redisClient.connect();

  io.on("error", (err) => {
    console.log(err);
  });

  io.on("connection", async (socket) => {
    socket.data.name = socket.handshake.query.name;
    socket.data.avatar = socket.handshake.query.avatar;
    socket.data.userId = socket.handshake.query.userId;
    socket.data.roomId = socket.handshake.query.roomId;

    const roomId = getId(socket.data.roomId);

    console.log(socket.data.name + " joined");

    const isRoomExist = await redisClient.exists(roomId);
    let room:
      | {
          id: string;
          pack: ServerPack | null;
          users: User[];
          isGameInProgress: boolean;
          isPaused: boolean;
        }
      | undefined;
    let isAdmin = false;

    const user: User = {
      id: uuidv4(),
      name: socket.data.name,
      avatar: socket.data.avatar ? socket.data.avatar : null,
      isOnline: true,
    };

    if (!isRoomExist) {
      room = {
        id: roomId,
        pack: null,
        users: [user],
        isGameInProgress: false,
        isPaused: false,
      };
      isAdmin = true;

      await redisClient.hSet(roomId, {
        id: roomId,
        pack: JSON.stringify(null),
        spy: JSON.stringify(null),
        card: JSON.stringify(null),
        users: JSON.stringify([user]),
        host: user.id,
        isGameInProgress: JSON.stringify(false),
        isPaused: JSON.stringify(false),
      });
    } else {
      const roomRaw = await redisClient.hGetAll(roomId);
      room = {
        id: roomRaw.id,
        users: JSON.parse(roomRaw.users),
        pack: JSON.parse(roomRaw.pack),
        isGameInProgress: JSON.parse(roomRaw.isGameInProgress),
        isPaused: JSON.parse(roomRaw.isPaused),
      };
      room.users.push(user);
      await redisClient.hSet(roomId, "users", JSON.stringify(room.users));

      io?.to(roomId).emit("userJoined", user);
    }

    socket.join(roomId);
    socket.emit("joinRoom", {
      userId: user.id,
      roomId: roomId,
      users: room.users,
      pack: room.pack,
      isGameInProgress: room.isGameInProgress,
      isPaused: room.isPaused,
      isAdmin,
    });

    socket.on("setPack", async (pack: ServerPack, roomId: string) => {
      await redisClient.hSet(roomId, "pack", JSON.stringify(pack));

      io?.to(roomId).emit("setPack", pack);
    });

    socket.on("startGame", async (roomId: string) => {
      const isGameInProgress: boolean = JSON.parse(
        (await redisClient.hGet(roomId, "isGameInProgress")) as string
      );

      if (isGameInProgress) return;

      await redisClient.hSet(roomId, "isGameInProgress", JSON.stringify(true));

      io?.to(roomId).emit("gameStarted");
    });

    socket.on("abortGame", async (roomId: string) => {
      const isGameInProgress: boolean = JSON.parse(
        (await redisClient.hGet(roomId, "isGameInProgress")) as string
      );

      if (!isGameInProgress) return;

      await redisClient.hSet(roomId, {
        isGameInProgress: JSON.stringify(false),
        isPaused: JSON.stringify(false),
      });

      io?.to(roomId).emit("gameAborted");
    });

    socket.on("pauseGame", async (roomId: string) => {
      const isPaused: boolean = JSON.parse(
        (await redisClient.hGet(roomId, "isPaused")) as string
      );

      if (isPaused) return;

      await redisClient.hSet(roomId, "isPaused", JSON.stringify(true));

      io?.to(roomId).emit("gamePaused");
    });

    socket.on("resumeGame", async (roomId: string) => {
      const isPaused: boolean = JSON.parse(
        (await redisClient.hGet(roomId, "isPaused")) as string
      );

      if (!isPaused) return;

      await redisClient.hSet(roomId, "isPaused", JSON.stringify(false));

      io?.to(roomId).emit("gameResumed");
    });

    socket.on("disconnect", async () => {
      console.log(socket.data.name + " leaved");

      const usersRaw = (await redisClient.hGet(roomId, "users")) as string;
      const users = JSON.parse(usersRaw) as User[];

      users.splice(
        users.findIndex((item) => item.id === user.id),
        1
      );

      if (!users.length) {
        await redisClient.del(roomId);
      } else {
        await redisClient.hSet(roomId, "users", JSON.stringify(users));
        io?.to(roomId).emit("userDisconnected", user.id);
      }
    });
  });
}

const ioMiddleware = createMiddleware<{
  Variables: {
    io: Server;
  };
}>(async (c, next) => {
  if (!c.var.io && io) {
    c.set("io", io);
  }
  await next();
});

export default ioMiddleware;

function getId(id: string | undefined) {
  const regExp = /\b([A-Z0-9\s]{5}\b)/g;

  if (id && regExp.test(id)) {
    return id;
  }

  return (
    Date.now().toString(36).slice(5) + Math.floor(Math.random() * 90 + 10)
  ).toUpperCase();
}
