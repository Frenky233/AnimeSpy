import { serve } from "@hono/node-server";
import { initWebsocket } from "./routes/game/game";
import app from "./app";
import "dotenv/config";

export const server = serve(
  {
    fetch: app.fetch,
    port: +(process.env.PORT || 5000),
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  }
);

initWebsocket(server);
