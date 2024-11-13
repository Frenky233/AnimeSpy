import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default redisClient;
