import app from "./app";

const PORT = Bun.env.PORT || 5000;

Bun.serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server Running on port ${PORT}`);
