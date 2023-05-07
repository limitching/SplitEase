import { pool } from "../databases/MySQL.database.js";
import { mongoose } from "../databases/Mongo.database.js";
import { CURRENCY_MAP } from "../utils/constant.js";

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
    status: { type: String, default: "unsettled" },
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
        return await Expense.find({ attached_group_id: group_id }).sort({
            date: -1,
            createTime: -1,
        });
    } catch (error) {
        return [];
    }
};

const getSettlingExpensesByGroupId = async (group_id) => {
    try {
        return await Expense.find({
            attached_group_id: group_id,
            status: "settling",
        });
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

const createExpense = async (expenseObject, user_id) => {
    const connection = await pool.getConnection();
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        await connection.query("START TRANSACTION");

        const newExpense = new Expense(expenseObject);
        const { _id } = await newExpense.save({ session });

        const logData = {
            user_id: user_id,
            group_id: expenseObject.attached_group_id,
            event: "create expense",
            event_target: expenseObject.description,
            event_value: `${
                CURRENCY_MAP[expenseObject.currency_option].symbol
            } ${expenseObject.amount}`,
        };
        await connection.query("INSERT INTO `logs` SET ?", logData);

        await session.commitTransaction();
        await connection.query("COMMIT");
        return { _id };
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        await session.abortTransaction();
        return { _id: -1 };
    } finally {
        await connection.release();
        session.endSession();
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

const updateExpense = async (expense_id, updatedExpenseObject, user_id) => {
    const connection = await pool.getConnection();
    const session = await mongoose.startSession();
    try {
        await connection.query("START TRANSACTION");
        let updateResult;
        await session.withTransaction(async () => {
            updateResult = await Expense.findOneAndUpdate(
                { _id: expense_id },
                updatedExpenseObject,
                { new: true },
                { session }
            );
            const logData = {
                user_id: user_id,
                group_id: updatedExpenseObject.attached_group_id,
                event: "update expense",
                event_target: updatedExpenseObject.description,
                event_value: `${
                    CURRENCY_MAP[updatedExpenseObject.currency_option].symbol
                } ${updatedExpenseObject.amount}`,
            };
            await connection.query("INSERT INTO `logs` SET ?", logData);
        });
        await connection.query("COMMIT");
        return updateResult;
    } catch (error) {
        await session.abortTransaction();
        await connection.query("ROLLBACK");
        console.error(error);
        return { _id: -1 };
    } finally {
        await connection.release();
        session.endSession();
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

const updateExpenseStatusByGroupId = async (group_id, deadline, user_id) => {
    const connection = await pool.getConnection();
    const session = await mongoose.startSession();
    const queryDeadline = new Date(deadline).setDate(
        new Date(deadline).getDate() + 1
    );
    //TODO:
    console.log(new Date(deadline).getDate());
    console.log(new Date(deadline).getDate() + 1);
    console.log("queryDeadline", queryDeadline);
    session.startTransaction();
    try {
        await connection.query("START TRANSACTION");
        const updateResult = await Expense.updateMany(
            {
                attached_group_id: group_id,
                date: { $lte: queryDeadline },
                status: "unsettled",
            },
            { $set: { status: "settling" } },
            { session }
        );

        // Logs
        const logData = {
            user_id: user_id,
            group_id: group_id,
            event: "update all expenses with a date prior to",
            event_target: deadline,
            event_value: "unsettled → settling",
        };
        await connection.query("INSERT INTO `logs` SET ?", logData);
        await connection.query("COMMIT");

        await session.commitTransaction();
        return updateResult;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        await session.abortTransaction();
        return { error: error };
    } finally {
        session.endSession();
        await connection.release();
    }
};

const deleteExpense = async (expense_id, group_id, user_id) => {
    const connection = await pool.getConnection();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await connection.query("START TRANSACTION");
        const deleteExpenseQuery =
            "DELETE FROM expense_users WHERE m_expense_id = ?";
        await connection.query(deleteExpenseQuery, [expense_id]);

        const deleteResult = await Expense.findOneAndDelete(
            {
                _id: expense_id,
                attached_group_id: group_id,
            },
            { session }
        );
        if (deleteResult === null) {
            await connection.query("ROLLBACK");
            await session.abortTransaction();
            return -400;
        }

        // Logs
        const logData = {
            user_id: user_id,
            group_id: group_id,
            event: "delete expense",
            event_target: deleteResult.description,
            event_value: `${
                CURRENCY_MAP[deleteResult.currency_option].symbol
            } ${deleteResult.amount}`,
        };
        await connection.query("INSERT INTO `logs` SET ?", logData);

        await session.commitTransaction();
        await connection.query("COMMIT");
        return 0;
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        await connection.query("ROLLBACK");
        return -1;
    } finally {
        await connection.release();
        session.endSession();
    }
};

const updateExpenseStatusToSettled = async (group_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.query(
            "UPDATE settlements SET `status` = 1 WHERE group_id = ? ",
            [group_id]
        );
        const updateResult = await Expense.updateMany(
            {
                attached_group_id: group_id,
                status: "settling",
            },
            { $set: { status: "settled" } }
        );
        return updateResult;
    } catch (error) {
        console.error(error);
        await connection.query("ROLLBACK");
        return { _id: -1 };
    } finally {
        await connection.release();
    }
};

export {
    getCurrencies,
    getExpensesByGroupId,
    getSettlingExpensesByGroupId,
    getExpensesByExpenseId,
    createExpenseUsers,
    createExpense,
    updateExpense,
    updateExpenseUsers,
    updateExpenseStatusByGroupId,
    deleteExpense,
    updateExpenseStatusToSettled,
};
