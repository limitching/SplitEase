import {
    getCurrencies,
    getExpensesByGroupId,
    getExpensesByExpenseId,
    createExpenseInvolvedMembers,
    createExpense,
    updateExpense,
    updateExpenseInvolvedMembers,
} from "../models/expense_model.js";

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

const updateGroupExpense = async (req, res, next) => {
    const {
        eid,
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
    const updatedExpenseObject = {
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

    // Update Expense in MongoDB
    const { _id } = await updateExpense(eid, updatedExpenseObject);
    if (_id === -1) {
        return res.status(500).json({ errors: [{ msg: "MongoDB Error" }] });
    }
    // Update involvedMembers into MySQL
    const updateInvolvedResult = await updateExpenseInvolvedMembers(
        eid,
        involved_users,
        date
    );
    if (updateInvolvedResult === -1) {
        return res.status(500).json({ errors: [{ msg: "MySQL Error" }] });
    }
    return res.status(200).json({ msg: `Successfully modified expense!` });
};

export {
    getGroupExpenses,
    createGroupExpense,
    getExpensesCurrencies,
    updateGroupExpense,
};
