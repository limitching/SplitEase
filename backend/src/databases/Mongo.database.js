import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import mongoose from "mongoose";
dotenv.config({ path: __dirname + "/../../.env" });

mongoose.connect(process.env.MONGODB_URI + "/SplitEase");

mongoose.connection.once("open", () => console.log("connected to database"));
mongoose.connection.on("error", (error) =>
  console.error("database error", error)
);

export { mongoose };
