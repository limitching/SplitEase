import { pool } from "../databases/MySQL.database.js";
import { mongoose } from "../databases/Mongo.database.js";

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
    attached_group_id: { type: String, default: null }, // index key
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

const Expense = mongoose.model("Expense", ExpenseSchema);

const getCurrencies = async () => {
    try {
        const currencyQuery = "SELECT * FROM currencies";
        const [currencies] = await pool.query(currencyQuery);
        return currencies;
    } catch (error) {
        console.error(error);
        return -1;
    }
};

export { Expense, getCurrencies };
