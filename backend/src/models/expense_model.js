import { pool } from "../databases/MySQL.database.js";
import { mongoose } from "../databases/Mongo.database.js";

const ExpenseSchema = new mongoose.Schema({
    description: { type: String },
    amount: {
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
    credit_users: { type: Map, of: Number }, // People who will receive money from others. They have a positive balance.
    debt_users: { type: Map, of: Number }, // People who will pay money to others. They have a negative balance.
    involved_users: [
        {
            type: Number,
        },
    ],
    comments: {},
    date: { type: Date, default: Date.now },
    image: { type: String },
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

const createExpenseInvolvedMembers = async (eid, involved_users, date) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const involvedMembersBinding = involved_users.map((uid) => [
            eid,
            uid,
            date,
        ]);
        const involvedMembersQuery =
            "INSERT INTO expense_members (eid, uid, expense_date) VALUES ?";
        const [insertResult] = await connection.query(involvedMembersQuery, [
            involvedMembersBinding,
        ]);
        await connection.query("COMMIT");
        return insertResult;
    } catch (error) {
        console.error(error);
        await conn.query("ROLLBACK");
        return [];
    } finally {
        await connection.release();
    }
};

export { Expense, getCurrencies, createExpenseInvolvedMembers };
