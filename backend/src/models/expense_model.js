import { pool } from "../databases/MySQL.database.js";
import { mongoose } from "../databases/Mongo.database.js";

const ExpenseSchema = new mongoose.Schema({
    description: { type: String },
    amount: {
        type: Number,
    },
    currency_option: {
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
    creditors_amounts: {
        type: Map,
        of: Number,
    },
    debtors_weight: {
        type: Map,
        of: Number,
    },
    debtors_adjustment: {
        type: Map,
        of: Number,
    },

    attached_group_id: { type: String, default: null }, // index key
    // credit_users: { type: Map, of: Number }, // People who will receive money from others. They have a positive balance.
    // debt_users: { type: Map, of: Number }, // People who will pay money to others. They have a negative balance.
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

const getExpensesByGroupId = async (group_id) => {
    try {
        return await Expense.find({ attached_group_id: group_id });
    } catch (error) {
        return -1;
    }
};

const getExpensesByExpenseId = async (expense_id) => {
    try {
        return await Expense.find({ expense_id: expense_id });
    } catch (error) {
        return -1;
    }
};

const createExpense = async (expenseObject) => {
    try {
        const newExpense = new Expense(expenseObject);
        return await newExpense.save();
    } catch (error) {
        console.error(error);
        return { _id: -1 };
    }
};

const createExpenseUsers = async (expense_id, involved_users, date) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const involvedUsersBinding = involved_users.map((user_id) => [
            expense_id,
            user_id,
            date,
        ]);
        const involvedUsersQuery =
            "INSERT INTO expense_users (m_expense_id, user_id, expense_date) VALUES ?";
        await connection.query(involvedUsersQuery, [involvedUsersBinding]);
        await connection.query("COMMIT");
        return 0;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        return -1;
    } finally {
        await connection.release();
    }
};

const updateExpense = async (expense_id, updatedExpenseObject) => {
    try {
        const updateResult = await Expense.findOneAndUpdate(
            { _id: expense_id },
            updatedExpenseObject,
            {
                new: true,
            }
        );
        return updateResult;
    } catch (error) {
        console.error(error);
        return { _id: -1 };
    }
};

const updateExpenseUsers = async (expense_id, involved_users, date) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const deleteInvolvedUsersQuery =
            "DELETE FROM expense_users WHERE m_expense_id = ?";
        await connection.query(deleteInvolvedUsersQuery, [expense_id]);
        const involvedUsersBinding = involved_users.map((user_id) => [
            expense_id,
            user_id,
            date,
        ]);
        const insertInvolvedUsersQuery =
            "INSERT INTO expense_users (m_expense_id, user_id, expense_date) VALUES ?";
        await connection.query(insertInvolvedUsersQuery, [
            involvedUsersBinding,
        ]);
        await connection.query("COMMIT");
        return 0;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        return -1;
    } finally {
        await connection.release();
    }
};

const deleteExpense = async (expense_id, group_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const deleteExpenseQuery =
            "DELETE FROM expense_users WHERE m_expense_id = ?";
        await connection.query(deleteExpenseQuery, [expense_id]);

        const deleteResult = await Expense.findOneAndDelete({
            _id: expense_id,
            attached_group_id: group_id,
        });
        if (deleteResult === null) {
            await connection.query("ROLLBACK");
            return -400;
        }

        await connection.query("COMMIT");
        return 0;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        return -1;
    } finally {
        await connection.release();
    }
};

export {
    getCurrencies,
    getExpensesByGroupId,
    getExpensesByExpenseId,
    createExpenseUsers,
    createExpense,
    updateExpense,
    updateExpenseUsers,
    deleteExpense,
};
