import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Server] running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("[Server Error]", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Rejection]", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[Uncaught Exception]", err);
  process.exit(1);
});