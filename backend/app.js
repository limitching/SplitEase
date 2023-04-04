import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();

const { API_VERSION } = process.env;

import indexRouter from "./src/routes/index.js";
import usersRouter from "./src/routes/users.js";
import groupRouter from "./src/routes/group_route.js";
import expenseRouter from "./src/routes/expense_route.js";

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// API routes
app.use("/api/" + API_VERSION, [
    indexRouter,
    usersRouter,
    groupRouter,
    expenseRouter,
]);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

export default app;
