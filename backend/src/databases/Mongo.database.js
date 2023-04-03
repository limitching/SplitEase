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

const ExpenseSchema = new mongoose.Schema({
    expense_id: { type: String, required: true, unique: true },
    description: { type: String },
    cost: {
        type: Number,
    },
    split_method: {
        type: String,
        enum: [
            "split equally",
            "split by exact amounts",
            "split by percentages",
            "split by shares",
            "split by adjustment",
        ],
        required: true,
    },
    attached_group_id: { type: Number, default: null }, // index key
    involved_users: {
        type: Map,
        of: Number, // MAP<user_id:balance>
        // People who will receive money from others. They have a positive balance.
        // People who will pay money to others. They have a negative balance.
    },
    comments: {},
    date: { type: Date, default: Date.now },
    createTime: {
        type: Date,
        default: Date.now,
    },
});
