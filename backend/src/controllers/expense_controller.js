import {
    Expense,
    getCurrencies,
    createExpenseInvolvedMembers,
} from "../models/expense_model.js";

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
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    } else {
        return res.status(200).json(expenses);
    }
};

const createGroupExpense = async (req, res, next) => {
    const {
        amount,
        description,
        date,
        split_method,
        attached_group_id,
        creditors,
        debtors,
        currencyOption,
    } = req.body;
    const creditorsObj = JSON.parse(creditors);
    const debtorsObj = JSON.parse(debtors);
    const credit_users = new Map();
    const debt_users = new Map();
    const involved_users = [];
    let image;
    req.file ? (image = "expenses/" + req.file.filename) : (image = null);

    credit_users.set(creditorsObj.id.toString(), -amount);
    involved_users.push(creditorsObj.id);
    debtorsObj.forEach((debtor) => {
        debt_users.set(debtor.id.toString(), amount / debtorsObj.length);
        if (involved_users.indexOf(debtor.id) === -1) {
            involved_users.push(debtor.id);
        }
    });
    const expenseObject = {
        description,
        split_method,
        amount,
        currencyOption,
        attached_group_id,
        credit_users,
        debt_users,
        involved_users,
        image,
        date,
    };
    // Insert Expense into MongoDB
    const { _id } = await createExpense(expenseObject);
    if (_id === -1) {
        return res.status(500).json({ errors: [{ msg: "MongoDB Error" }] });
    }
    // Insert involvedMembers into MySQL
    const createInvolvedResult = await createExpenseInvolvedMembers(
        _id,
        involved_users,
        date
    );
    if (createInvolvedResult === -1) {
        return res.status(500).json({ errors: [{ msg: "MySQL Error" }] });
    }
    return res
        .status(200)
        .json({ msg: `New expense_id: ${_id} was created!!` });
};
const getExpensesCurrencies = async (req, res, next) => {
    const currencies = await getCurrencies();
    if (currencies === -1) {
        return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server Error" }] });
    } else {
        return res.status(200).json(currencies);
    }
};

export { getGroupExpenses, createGroupExpense, getExpensesCurrencies };
