import { Hono } from "hono";
import { logger } from "hono/logger";
import searchRoute from "./routes/search/search";
import ioMiddleware from "./routes/game/game";
import type { Env } from "./type";

const app = new Hono<Env>();

app.use("*", logger());
app.use(ioMiddleware);

const apiRoutes = app.basePath("/api").route("/search", searchRoute);

export default app;
