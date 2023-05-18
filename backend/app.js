import http from "http";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { normalizePort, serverOnError } from "./src/utils/util.js";
import cors from "cors";
import { initSocketIO } from "./src/services/socketIO.js";
import dotenv from "dotenv";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/.env" });

const { API_VERSION, PORT } = process.env;

const app = express();
const port = normalizePort(PORT || "3000");
app.set("port", port);
const server = http.createServer(app);

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output-doc.json" assert { type: "json" };
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use("/api/" + API_VERSION, [indexRouter, userRouter, groupRouter, expenseRouter, debtsRouter]);

// Perform socket.io configuration and connection
initSocketIO(server);

// catch error and forward to error handler
import errorHandler from "./src/middlewares/errorHandler.js";
app.use(errorHandler);

// if no route is matched by now, redirect to splitease.cc (frontend)
app.use((req, res, next) => {
  res.redirect("https://splitease.cc/");
});

// listen on provided port
server.listen(port);
server.on("error", serverOnError);

export default app;
