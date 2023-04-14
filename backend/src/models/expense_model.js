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

const getExpensesByGroupId = async (gid) => {
    try {
        return await Expense.find({ attached_group_id: gid });
    } catch (error) {
        return -1;
    }
};

const getExpensesByExpenseId = async (eid) => {
    try {
        return await Expense.find({ expense_id: eid });
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
        await connection.query(involvedMembersQuery, [involvedMembersBinding]);
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

const updateExpense = async (eid, updatedExpenseObject) => {
    try {
        const updateResult = await Expense.findOneAndUpdate(
            { _id: eid },
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

const updateExpenseInvolvedMembers = async (eid, involved_users, date) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const deleteInvolvedMemberQuery =
            "DELETE FROM expense_members WHERE eid = ?";
        await connection.query(deleteInvolvedMemberQuery, [eid]);
        const involvedMembersBinding = involved_users.map((uid) => [
            eid,
            uid,
            date,
        ]);
        const insertInvolvedMembersQuery =
            "INSERT INTO expense_members (eid, uid, expense_date) VALUES ?";
        await connection.query(insertInvolvedMembersQuery, [
            involvedMembersBinding,
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

const deleteExpense = async (eid, gid) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("START TRANSACTION");
        const deleteExpenseQuery = "DELETE FROM expense_members WHERE eid = ?";
        await connection.query(deleteExpenseQuery, [eid]);

        const deleteResult = await Expense.findOneAndDelete({
            _id: eid,
            attached_group_id: gid,
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
    createExpenseInvolvedMembers,
    createExpense,
    updateExpense,
    updateExpenseInvolvedMembers,
    deleteExpense,
};
