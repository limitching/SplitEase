import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config();

const { API_VERSION } = process.env;

import indexRouter from "./src/routes/index.js";
import userRouter from "./src/routes/user_route.js";
import groupRouter from "./src/routes/group_route.js";
import expenseRouter from "./src/routes/expense_route.js";
import debtsRouter from "./src/routes/debts_route.js";
import botRouter from "./src/routes/bot_route.js";

const app = express();
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

app.use(logger("dev"));

// catch error and forward to error handler
import errorHandler from "./src/middlewares/errorHandler.js";
app.use(errorHandler);

export default app;
