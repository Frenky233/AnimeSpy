import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { createMiddleware } from "hono/factory";
import { v4 as uuidv4 } from "uuid";
import type { ServerPack, User } from "./type";
import redisClient from "../../db/db";
import type { PackItem } from "../../../frontend/src/db/db";

let io: Server | null;

let timers: Record<string, Timer> = {};

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
    socket.data.name = socket.handshake.query.name?.slice(0, 16);
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
          timeLeft: number;
          card: PackItem | null;
        }
      | undefined;
    let isAdmin = false;
    let isReconnect = false;
    let isSpy = false;

    const user: User = {
      id: socket.data.userId ? socket.data.userId : uuidv4(),
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
        timeLeft: 600,
        card: null,
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
        timeLeft: 600000,
        lastPause: JSON.stringify(null),
      });
    } else {
      const roomRaw = await redisClient.hGetAll(roomId);

      room = {
        id: roomRaw.id,
        users: JSON.parse(roomRaw.users),
        pack: JSON.parse(roomRaw.pack),
        isGameInProgress: JSON.parse(roomRaw.isGameInProgress),
        isPaused: JSON.parse(roomRaw.isPaused),
        card: JSON.parse(roomRaw.card),
        timeLeft:
          !JSON.parse(roomRaw.isPaused) && JSON.parse(roomRaw.isGameInProgress)
            ? +roomRaw.timeLeft / 1000 -
              Math.round((Date.now() - +roomRaw.lastPause) / 1000)
            : +roomRaw.timeLeft / 1000,
      };

      isAdmin = roomRaw.host === user.id;
      isSpy = roomRaw.spy === user.id;

      const isUserExist =
        room.isGameInProgress && room.users.find(({ id }) => id === user.id);

      if (isUserExist) {
        room.users[room.users.indexOf(isUserExist)].isOnline = true;
        isReconnect = true;

        io?.to(roomId).emit("userReconnected", user);
      } else {
        room.users.push(user);

        io?.to(roomId).emit("userJoined", user);
      }

      await redisClient.hSet(roomId, "users", JSON.stringify(room.users));
    }

    socket.join(roomId);
    socket.emit("joinRoom", {
      userId: user.id,
      roomId: roomId,
      users: room.users,
      pack: room.pack,
      isGameInProgress: room.isGameInProgress,
      isPaused: room.isPaused,
      timeLeft: room.timeLeft,
      card: isSpy ? null : room.card,
      isSpy,
      isAdmin,
      isReconnect,
    });

    socket.on(
      "setPack",
      async (pack: ServerPack, roomId: string, userId: string) => {
        if (!(await checkIsAdmin(userId, roomId))) return;

        const isGameInProgress: boolean = JSON.parse(
          (await redisClient.hGet(roomId, "isGameInProgress")) as string
        );

        if (isGameInProgress) return;

        pack.name = pack.name.slice(0, 16);

        await redisClient.hSet(roomId, "pack", JSON.stringify(pack));

        io?.to(roomId).emit("setPack", pack);
      }
    );

    socket.on("startGame", async (roomId: string, userId: string) => {
      if (!(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, [
        "pack",
        "isGameInProgress",
        "users",
      ]);
      const pack: ServerPack | null = JSON.parse(data[0]);
      const isGameInProgress: boolean = JSON.parse(data[1]);
      const users: User[] = JSON.parse(data[2]);

      if (!pack) return;
      if (isGameInProgress) return;

      const card = pack.items[Math.floor(Math.random() * pack.items.length)];
      const spy = users[Math.floor(Math.random() * users.length)].id;

      await redisClient.hSet(roomId, {
        isGameInProgress: JSON.stringify(true),
        lastPause: Date.now(),
        spy: spy,
        card: JSON.stringify(card),
      });

      timers[roomId] = setTimeout(() => {
        io?.to(roomId).emit("timerEnd");
      }, 600 * 1000);

      (await io?.in(roomId).fetchSockets())?.forEach((socket) =>
        socket.emit("gameStarted", {
          isSpy: socket.data.userId === spy,
          card: socket.data.userId === spy ? null : card,
        })
      );
    });

    socket.on("newRound", async (roomId: string, userId: string, callback) => {
      console.log("data");

      const data = await redisClient.hmGet(roomId, ["spy", "card"]);
      const spy: string = data[0];
      const card: PackItem = JSON.parse(data[1]);

      callback({ isSpy: spy === userId, card: spy === userId ? null : card });
    });

    socket.on("abortGame", async (roomId: string, userId: string) => {
      if (!(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, [
        "isGameInProgress",
        "users",
      ]);

      const isGameInProgress: boolean = JSON.parse(data[0]);
      const users: User[] = JSON.parse(data[1]);
      const newUsers = users.filter((user) => user.isOnline);

      if (!isGameInProgress) return;

      await redisClient.hSet(roomId, {
        isGameInProgress: JSON.stringify(false),
        isPaused: JSON.stringify(false),
        lastPause: JSON.stringify(null),
        timeLeft: 600 * 1000,
        users: JSON.stringify(newUsers),
        spy: JSON.stringify(null),
        card: JSON.stringify(null),
      });

      io?.to(roomId).emit("gameAborted", newUsers);
    });

    socket.on("pauseGame", async (roomId: string, userId: string) => {
      if (!(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, [
        "isPaused",
        "lastPause",
        "timeLeft",
      ]);

      const isPaused: boolean = JSON.parse(data[0]);
      const lastPause: number = +data[1];
      const timeLeft: number = +data[2];

      if (isPaused) return;

      await redisClient.hSet(roomId, {
        isPaused: JSON.stringify(true),
        timeLeft:
          Math.round((timeLeft - (Date.now() - lastPause)) / 1000) * 1000,
      });

      clearTimeout(timers[roomId]);

      io?.to(roomId).emit("gamePaused");
    });

    socket.on("resumeGame", async (roomId: string, userId: string) => {
      if (!(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, ["isPaused", "timeLeft"]);

      const isPaused: boolean = JSON.parse(data[0]);
      const timeLeft: number = +data[1];

      if (!isPaused) return;

      await redisClient.hSet(roomId, {
        isPaused: JSON.stringify(false),
        lastPause: Date.now(),
      });

      timers[roomId] = setTimeout(() => {
        io?.to(roomId).emit("timerEnd");
      }, timeLeft);

      io?.to(roomId).emit("gameResumed");
    });

    socket.on("disconnect", async () => {
      console.log(socket.data.name + " leaved");

      const usersRaw = (await redisClient.hGet(roomId, "users")) as string;
      const users = JSON.parse(usersRaw) as User[];
      const userIndex = users.findIndex((item) => item.id === user.id);
      const isGameInProgress = JSON.parse(
        (await redisClient.hGet(roomId, "isGameInProgress")) as string
      ) as boolean;

      if (isGameInProgress) {
        users[userIndex].isOnline = false;
        await redisClient.hSet(roomId, "users", JSON.stringify(users));
        io?.to(roomId).emit("userLostConnection", users[userIndex]);
        if (users.length === users.filter(({ isOnline }) => !isOnline).length)
          await redisClient.del(roomId);

        return;
      }

      users.splice(userIndex, 1);

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

async function checkIsAdmin(userId: string, gameId: string) {
  const adminId = await redisClient.hGet(gameId, "host");

  return adminId === userId;
}
