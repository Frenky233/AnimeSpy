import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { createMiddleware } from "hono/factory";
import { v4 as uuidv4 } from "uuid";
import type { ServerPack, User, Voting } from "./type";
import redisClient from "../../db/db";
import type { PackItem } from "../../../frontend/src/db/db";
import "dotenv/config";

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
    socket.data.avatar = await checkAvatarSize(socket.handshake.query.avatar);
    socket.data.userId = socket.handshake.query.userId
      ? socket.handshake.query.userId
      : uuidv4();
    socket.data.roomId = socket.handshake.query.roomId;

    const roomId = getId(socket.data.roomId);

    console.log(socket.data.name + " joined");

    const isRoomExist = await redisClient.exists(roomId);
    let room:
      | {
          id: string;
          pack: ServerPack | null;
          cardsForRound: PackItem[] | null;
          users: User[];
          isGameInProgress: boolean;
          isPaused: boolean;
          timeLeft: number;
          card: PackItem | null;
          usersOnline: number;
          isCardsPicked: boolean;
        }
      | undefined;
    let isAdmin = false;
    let isReconnect = false;
    let isSpy = false;
    let voting: Voting = {
      isVoting: false,
      votingStartTime: null,
      isVoted: null,
      targetId: null,
      userId: null,
    };

    const user: User = {
      id: socket.data.userId,
      name: socket.data.name,
      avatar: socket.data.avatar ? socket.data.avatar : null,
      isOnline: true,
      isObserver: false,
      isVoted: null,
      score: 0,
    };

    if (!isRoomExist) {
      room = {
        id: roomId,
        pack: null,
        cardsForRound: null,
        users: [user],
        isGameInProgress: false,
        isPaused: false,
        timeLeft: 600,
        card: null,
        usersOnline: 1,
        isCardsPicked: false,
      };
      isAdmin = true;

      await redisClient.hSet(roomId, {
        id: roomId,
        pack: JSON.stringify(null),
        spy: JSON.stringify(null),
        cardsForRound: JSON.stringify(null),
        isCardsPicked: JSON.stringify(false),
        card: JSON.stringify(null),
        users: JSON.stringify([user]),
        host: user.id,
        usersOnline: 1,
        isGameInProgress: JSON.stringify(false),
        isPaused: JSON.stringify(false),
        timeLeft: 600000,
        lastPause: JSON.stringify(null),
        isVoting: JSON.stringify(false),
        votedUsersAmount: 0,
        votingTarget: JSON.stringify(null),
        votingInitiator: JSON.stringify(null),
        votingStartTime: JSON.stringify(null),
      });
    } else {
      const roomRaw = await redisClient.hGetAll(roomId);

      room = {
        id: roomRaw.id,
        users: JSON.parse(roomRaw.users),
        pack: JSON.parse(roomRaw.pack),
        cardsForRound: JSON.parse(roomRaw.cardsForRound),
        isCardsPicked: JSON.parse(roomRaw.isCardsPicked),
        isGameInProgress: JSON.parse(roomRaw.isGameInProgress),
        isPaused: JSON.parse(roomRaw.isPaused),
        card: JSON.parse(roomRaw.card),
        usersOnline: +roomRaw.usersOnline,
        timeLeft:
          !JSON.parse(roomRaw.isPaused) && JSON.parse(roomRaw.isGameInProgress)
            ? +roomRaw.timeLeft / 1000 -
              Math.round((Date.now() - +roomRaw.lastPause) / 1000)
            : +roomRaw.timeLeft / 1000,
      };

      isAdmin = roomRaw.host === user.id;
      isSpy = roomRaw.spy === user.id;
      voting.isVoting = JSON.parse(roomRaw.isVoting);
      voting.votingStartTime = JSON.parse(roomRaw.votingStartTime);

      const isUserExist =
        room.isGameInProgress && room.users.find(({ id }) => id === user.id);

      if (isUserExist) {
        room.users[room.users.indexOf(isUserExist)].isOnline = true;
        isReconnect = true;
        voting = {
          ...voting,
          isVoted: room.users.find(({ id }) => id === user.id)?.isVoted || null,
          targetId: roomRaw.votingTarget,
          userId: roomRaw.votingInitiator,
        };

        console.log(room.isPaused);

        io?.to(roomId).emit("userReconnected", user);
      } else {
        user.isObserver = room.isGameInProgress;
        room.users.push(user);

        io?.to(roomId).emit("userJoined", user);
      }

      if (!user.isObserver) room.usersOnline += 1;

      await redisClient.hSet(roomId, {
        users: JSON.stringify(room.users),
        usersOnline: room.usersOnline,
      });
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
      card: user.isObserver ? null : isSpy ? null : room.card,
      isSpy,
      isAdmin,
      isReconnect,
      voting,
      cardsForRound: room.cardsForRound,
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

    socket.on(
      "startGame",
      async (
        roomId: string,
        userId: string,
        cardsAmount: number,
        minutes: number
      ) => {
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

        const isCardsPicked = cardsAmount !== pack.items.length;
        const cardsForRound = isCardsPicked
          ? pickCardsForRound(pack.items, cardsAmount)
          : pack.items;
        const card =
          cardsForRound[Math.floor(Math.random() * cardsForRound.length)];
        const spy = users[Math.floor(Math.random() * users.length)].id;

        await redisClient.hSet(roomId, {
          isGameInProgress: JSON.stringify(true),
          lastPause: Date.now(),
          spy: spy,
          card: JSON.stringify(card),
          timeLeft: minutes * 60 * 1000,
          cardsForRound: isCardsPicked
            ? JSON.stringify(cardsForRound)
            : JSON.stringify(null),
          isCardsPicked: JSON.stringify(isCardsPicked),
        });

        timers[roomId] = setTimeout(
          async () => await timerEnd(roomId),
          minutes * 60 * 1000
        );

        (await io?.in(roomId).fetchSockets())?.forEach((socket) =>
          socket.emit("gameStarted", {
            isSpy: socket.data.userId === spy,
            card: socket.data.userId === spy ? null : card,
            cardsForRound:
              cardsAmount === pack.items.length ? null : cardsForRound,
            minutes,
          })
        );
      }
    );

    const abortGame = async (
      roomId: string,
      userId: string,
      isVoting: true | undefined = undefined,
      isSpyWon: boolean | undefined = undefined,
      spyId: string | undefined = undefined
    ) => {
      if (!isVoting && !(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, [
        "isGameInProgress",
        "users",
        "isCardsPicked",
      ]);

      const isGameInProgress: boolean = JSON.parse(data[0]);
      const isCardsPicked: boolean = JSON.parse(data[2]);
      const users: User[] = JSON.parse(data[1]);
      const spy = users.find(({ id }) => id === spyId);

      if (isSpyWon && isVoting) {
        spy!.score += 1;
      } else if (!isSpyWon && isVoting) {
        users.forEach((user) => {
          if (user.id !== spyId) user.score += 1;
        });
      }

      const newUsers = users
        .filter((user) => user.isOnline)
        .map((user) => {
          return { ...user, isObserver: false, isVoted: null };
        });

      if (!isGameInProgress) return;

      clearTimeout(timers[roomId]);
      clearTimeout(timers[`voting ${roomId}`]);

      await redisClient.hSet(roomId, {
        isGameInProgress: JSON.stringify(false),
        isPaused: JSON.stringify(false),
        lastPause: JSON.stringify(null),
        timeLeft: 600 * 1000,
        users: JSON.stringify(newUsers),
        spy: JSON.stringify(null),
        card: JSON.stringify(null),
        cardsForRound: JSON.stringify(null),
        isVoting: JSON.stringify(false),
        votingTarget: JSON.stringify(null),
        votingInitiator: JSON.stringify(null),
        votingStartTime: JSON.stringify(null),
        votedUsersAmount: 0,
        isCardsPicked: JSON.stringify(false),
      });

      if (!isVoting)
        io?.to(roomId).emit("gameAborted", newUsers, isCardsPicked);

      return { users: newUsers, spy };
    };

    socket.on("abortGame", abortGame);

    const pauseGame = async (
      roomId: string,
      userId: string,
      isVoting: undefined | true = undefined
    ) => {
      if (!isVoting && !(await checkIsAdmin(userId, roomId))) return;

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

      if (!isVoting) io?.to(roomId).emit("gamePaused");
    };

    const resumeGame = async (
      roomId: string,
      userId: string,
      isOnVotingEnd: true | undefined = undefined
    ) => {
      if (!isOnVotingEnd && !(await checkIsAdmin(userId, roomId))) return;

      const data = await redisClient.hmGet(roomId, ["isPaused", "timeLeft"]);

      const isPaused: boolean = JSON.parse(data[0]);
      const timeLeft: number = +data[1];

      if (!isPaused) return;

      await redisClient.hSet(roomId, {
        isPaused: JSON.stringify(false),
        lastPause: Date.now(),
      });

      timers[roomId] = setTimeout(async () => await timerEnd(roomId), timeLeft);

      io?.to(roomId).emit("gameResumed");
    };

    socket.on(
      "startVote",
      async (
        type: "Player" | "Card",
        roomId: string,
        userId: string,
        voteId: string
      ) => {
        if (type === "Player") {
          io?.to(roomId).emit("voteInitiated", userId, voteId);

          const users: User[] = JSON.parse(
            (await redisClient.hGet(roomId, "users")) as string
          );

          timers[`voting ${roomId}`] = setTimeout(async () => {
            await resumeGame(roomId, userId, true);

            await redisClient.hSet(roomId, {
              isVoting: JSON.stringify(false),
              votingTarget: JSON.stringify(null),
              users: JSON.stringify(users),
              votedUsersAmount: 0,
            });

            io?.to(roomId).emit("votingEnded");
          }, 10000);

          await pauseGame(roomId, userId, true);

          const newUsers = users
            .filter(({ isObserver }) => !isObserver)
            .map((user) => {
              return {
                ...user,
                isVoted:
                  user.id === userId || (voteId === user.id ? false : null),
              };
            });

          await redisClient.hSet(roomId, {
            isVoting: JSON.stringify(true),
            votingTarget: voteId,
            votingInitiator: userId,
            votingStartTime: Date.now(),
            users: JSON.stringify(newUsers),
            votedUsersAmount: 2,
          });
        } else {
          const data = await redisClient.hmGet(roomId, [
            "card",
            "spy",
            "users",
          ]);
          const card: PackItem = JSON.parse(data[0]);
          const spyId = data[1];

          if (userId !== spyId) return;

          const users = await abortGame(
            roomId,
            userId,
            true,
            card.id === voteId,
            spyId
          );

          io?.to(roomId).emit(
            "endGame",
            card.id === voteId,
            users!.users,
            users!.spy,
            card
          );
        }
      }
    );

    socket.on(
      "submitVote",
      async (roomId: string, userId: string, vote: boolean) => {
        const data = await redisClient.hmGet(roomId, [
          "isVoting",
          "users",
          "votedUsersAmount",
          "onlineUsers",
        ]);
        const isVoting: boolean = JSON.parse(data[0]);

        if (!isVoting) return;

        const votedUsers: User[] = JSON.parse(data[1]);
        let votedUsersAmount: number = +JSON.parse(data[2]);
        const onlineUsers: number = +JSON.parse(data[3]);

        votedUsers.find(({ id }) => id === userId)!.isVoted = vote;
        votedUsersAmount += 1;

        await redisClient.hSet(roomId, {
          users: JSON.stringify(votedUsers),
          votedUsersAmount,
        });

        io?.to(roomId).emit("userVoted", userId, vote);

        if (votedUsersAmount >= onlineUsers) {
          const votedForKick = votedUsers.filter(
            ({ isVoted }) => isVoted
          ).length;

          clearTimeout(timers[`voting ${roomId}`]);

          if (votedForKick >= votedUsers.length - 1) {
            const data = await redisClient.hmGet(roomId, [
              "votingTarget",
              "spy",
              "card",
            ]);
            const votingTarget: string = data[0];
            const spyId: string = data[1];
            const card: PackItem = JSON.parse(data[2]);

            const isSpyWon = votingTarget !== spyId;

            const { users, spy } = (await abortGame(
              roomId,
              "",
              true,
              isSpyWon,
              spyId
            ))!;

            io?.to(roomId).emit("endGame", isSpyWon, users, spy, card);
          } else {
            resumeGame(roomId, userId, true);
            io?.to(roomId).emit("votingEnded");
          }

          await redisClient.hSet(roomId, {
            isVoting: JSON.stringify(false),
            votingTarget: JSON.stringify(null),
            votingInitiator: JSON.stringify(null),
            votingStartTime: JSON.stringify(null),
            votedUsersAmount: 0,
          });
        }
      }
    );

    socket.on("pauseGame", pauseGame);

    socket.on("resumeGame", resumeGame);

    socket.on("disconnect", async () => {
      console.log(socket.data.name + " leaved");

      const data = await redisClient.hmGet(roomId, [
        "users",
        "isGameInProgress",
        "usersOnline",
      ]);

      const users: User[] = JSON.parse(data[0]);
      const userIndex = users.findIndex((item) => item.id === user.id);
      const isGameInProgress: boolean = JSON.parse(data[1]);
      let usersOnline: number = +data[2];

      usersOnline -= 1;

      if (isGameInProgress) {
        users[userIndex].isOnline = false;
        await redisClient.hSet(roomId, {
          users: JSON.stringify(users),
          usersOnline: usersOnline,
        });
        io?.to(roomId).emit("userLostConnection", users[userIndex]);
        if (users.length === users.filter(({ isOnline }) => !isOnline).length)
          await redisClient.del(roomId);

        return;
      }

      users.splice(userIndex, 1);

      if (!usersOnline) {
        clearTimeout(timers[roomId]);
        clearTimeout(timers[`voting ${roomId}`]);

        await redisClient.del(roomId);
      } else {
        await redisClient.hSet(roomId, {
          users: JSON.stringify(users),
          usersOnline: usersOnline,
        });
        io?.to(roomId).emit("userDisconnected", user.id);
      }
    });

    const timerEnd = async (roomId: string) => {
      const exist = await redisClient.exists(roomId);
      if (!exist) return;

      const data = await redisClient.hmGet(roomId, ["spy", "card"]);

      const spy = data[0];
      const card: PackItem = JSON.parse(data[1]);

      const results = (await abortGame(roomId, "", true, true, spy))!;

      io?.to(roomId).emit("endGame", true, results.users, results.spy, card);
    };
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

async function checkAvatarSize(avatarID: string | string[] | undefined) {
  if (typeof avatarID !== "string") return null;

  const headers = new Headers();
  headers.append("Authorization", `Client-ID ${process.env.IMGUR_CLIENT_ID}`);

  const response = await fetch(`https://api.imgur.com/3/image/${avatarID}`, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  return data.data.size <= 1048576
    ? `https://i.imgur.com/${avatarID}.png`
    : null;
}

function pickCardsForRound(cards: PackItem[], amount: number): PackItem[] {
  const result = new Array(amount);
  let len = cards.length;
  const taken = new Array(len);
  while (amount--) {
    const x = Math.floor(Math.random() * len);
    result[amount] = cards[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
