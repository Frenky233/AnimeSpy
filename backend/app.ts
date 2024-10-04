import { Hono } from "hono";
import { logger } from "hono/logger";
import searchRoute from "./routes/search";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["POST", "GET"],
    maxAge: 600,
  })
);

app.route("/api/search", searchRoute);

export default app;
