import http from "http";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { normalizePort, serverOnError } from "./src/utils/util.js";
import logger from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { initializePubSub } from "./src/services/adapter.js";
import dotenv from "dotenv";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config();

const { API_VERSION, PORT } = process.env;

const app = express();
const port = normalizePort(PORT || "3000");
app.set("port", port);
const server = http.createServer(app);

import indexRouter from "./src/routes/index.js";
import userRouter from "./src/routes/user_route.js";
import groupRouter from "./src/routes/group_route.js";
import expenseRouter from "./src/routes/expense_route.js";
import debtsRouter from "./src/routes/debts_route.js";
import botRouter from "./src/routes/bot_route.js";

// API routes
app.use("/api/" + API_VERSION, [botRouter]);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS allow all
app.use(cors());

// API routes
app.use("/api/" + API_VERSION, [
  indexRouter,
  userRouter,
  groupRouter,
  expenseRouter,
  debtsRouter,
]);

// Perform socket.io configuration and connection
const { redisPub, redisSub } = initializePubSub();
const io = new Server(server, {
  cors: { origin: "*" },
  adapter: createAdapter(redisPub, redisSub),
});

io.on("connection", async (socket) => {
  socket.emit("connection");
  console.log("a user connected (Server)");
  const group_slug = socket.handshake.query.slug;

  //Join group via slug
  socket.join(group_slug);

  socket.on("refreshMembers", () => {
    if (redisPub.connected) {
      redisPub.publish("refreshMembers", group_slug, (err) => {
        if (err) console.error("Redis publish error:", err);
      });
    } else {
      io.to(group_slug).emit("refreshMembers");
    }
  });

  socket.on("logsChange", () => {
    if (redisPub.connected) {
      redisPub.publish("logsChange", group_slug, (err) => {
        if (err) console.error("Redis publish error:", err);
      });
    } else {
      io.to(group_slug).emit("logsChange");
    }
  });

  socket.on("expenseChange", () => {
    if (redisPub.connected) {
      redisPub.publish("expenseChange", group_slug, (err) => {
        if (err) console.error("Redis publish error:", err);
      });
    } else {
      io.to(group_slug).emit("expenseChange");
    }
  });

  socket.on("leave-group", (group_slug) => {
    console.log(`User left group: ${group_slug}`);
    socket.leave(group_slug); // leave group
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Subscribe to Redis channels and emit messages to clients
redisSub.subscribe("refreshMembers", "logsChange", "expenseChange");
redisSub.on("message", (channel, group_slug) => {
  console.log(`Received message on channel ${channel} for group ${group_slug}`);
  io.to(group_slug).emit(channel);
});

app.use(logger("dev"));

// catch error and forward to error handler
import errorHandler from "./src/middlewares/errorHandler.js";
app.use(errorHandler);

// listen on provided port
server.listen(port);
server.on("error", serverOnError);

export default app;
