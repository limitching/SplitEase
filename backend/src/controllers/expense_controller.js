import { Expense, getCurrencies } from "../models/expense_model.js";

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

const getGroupExpenses = async (req, res, next) => {
    const groupId = req.query.gid;
    const expenses = await getExpensesByGroupId(groupId);
    if (expenses === -1) {
        return res.status(500).json({ msg: "Internal Server Error" });
    } else {
        return res.status(200).json({ data: expenses });
    }
};

const createGroupExpense = async (req, res, next) => {
    const expenseObject = req.body;
    // TODO: Remove log
    // console.log("body", expenseObject);
    const { _id } = await createExpense(expenseObject);
    if (_id === -1) {
        return res.status(500).json({ msg: "Internal Server Error" });
    } else {
        return res
            .status(200)
            .json({ msg: `New expense_id: ${_id} was created!!` });
    }
};
const getExpensesCurrencies = async (req, res, next) => {
    const currencies = await getCurrencies();
    if (currencies === -1) {
        return res.status(500).json({ msg: "Internal Server Error" });
    } else {
        return res.status(200).json(currencies);
    }
};

export { getGroupExpenses, createGroupExpense, getExpensesCurrencies };
