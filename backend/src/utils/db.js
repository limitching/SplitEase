import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import mongoose from "mongoose";
dotenv.config({ path: __dirname + "/../../.env" });

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

async function poolEnd() {
  return pool.end();
}

mongoose.connect(process.env.MONGODB_URI + "/SplitEase");

mongoose.connection.once("open", () => console.log("connected to database"));
mongoose.connection.on("error", (error) =>
  console.error("database error", error)
);

export { pool, poolEnd, mongoose };
