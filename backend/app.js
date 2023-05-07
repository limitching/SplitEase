import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

export default app;
