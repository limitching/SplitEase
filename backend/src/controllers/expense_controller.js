import {
  getCurrencies,
  getExpensesByGroupId,
  createExpenseUsers,
  createExpense,
  updateExpense,
  updateExpenseUsers,
  deleteExpense,
} from "../models/expense_model.js";
import { customizedError } from "../utils/error.js";
const getExpensesCurrencies = async (req, res, next) => {
  const currencies = await getCurrencies();
  if (currencies === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  } else {
    return res.status(200).json(currencies);
  }
};

const getGroupExpenses = async (req, res, next) => {
  const group_id = req.query.group_id;
  const expenses = await getExpensesByGroupId(group_id);
  if (expenses === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  } else {
    return res.status(200).json(expenses);
  }
};

const createGroupExpense = async (req, res, next) => {
  const user_id = req.user.id;
  const {
    amount,
    description,
    date,
    split_method,
    attached_group_id,
    currency_option,
    creditorsAmounts,
    debtorsWeight,
    debtorsAdjustment,
  } = req.body;
  const involved_users = [];
  const creditorsArray = JSON.parse(creditorsAmounts);
  const creditors_amounts = creditorsArray.reduce(
    (result, [creditor, amount]) => {
      result[creditor] = amount;
      involved_users.push(creditor);
      return result;
    },
    {}
  );
  const debtorsArray = JSON.parse(debtorsWeight);
  const debtors_weight = debtorsArray.reduce((result, [debtor, weight]) => {
    result[debtor] = weight;
    if (involved_users.indexOf(debtor) === -1) {
      involved_users.push(debtor);
    }
    return result;
  }, {});
  let image;
  req.file ? (image = "expenses/" + req.file.filename) : (image = null);

  const debtorsAdjustmentArray = debtorsAdjustment
    ? JSON.parse(debtorsAdjustment)
    : [];
  const debtors_adjustment = debtorsAdjustmentArray.reduce(
    (result, [debtor, weight]) => {
      result[debtor] = weight;
      if (involved_users.indexOf(debtor) === -1) {
        involved_users.push(debtor);
      }
      return result;
    },
    {}
  );

  const expenseObject = {
    description,
    split_method,
    amount,
    currency_option,
    attached_group_id,
    involved_users,
    image,
    date,
    creditors_amounts,
    debtors_weight,
    debtors_adjustment,
  };
  // Insert Expense into MongoDB
  const { _id } = await createExpense(expenseObject, user_id);

  if (_id === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  // Insert involvedMembers into MySQL
  const createInvolvedResult = await createExpenseUsers(
    _id,
    involved_users,
    date
  );
  if (createInvolvedResult === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  return res.status(200).json({ msg: `New expense_id: ${_id} was created!!` });
};

const updateGroupExpense = async (req, res, next) => {
  const user_id = req.user.id;
  const {
    expense_id,
    amount,
    description,
    date,
    split_method,
    attached_group_id,
    currency_option,
    creditorsAmounts,
    debtorsWeight,
    debtorsAdjustment,
  } = req.body;

  const involved_users = [];
  const creditorsArray = JSON.parse(creditorsAmounts);
  const creditors_amounts = creditorsArray.reduce(
    (result, [creditor, amount]) => {
      result[creditor] = amount;
      involved_users.push(creditor);
      return result;
    },
    {}
  );
  const debtorsArray = JSON.parse(debtorsWeight);
  const debtors_weight = debtorsArray.reduce((result, [debtor, weight]) => {
    result[debtor] = weight;
    if (involved_users.indexOf(debtor) === -1) {
      involved_users.push(debtor);
    }
    return result;
  }, {});
  let image;
  req.file ? (image = "expenses/" + req.file.filename) : (image = null);

  const debtorsAdjustmentArray = debtorsAdjustment
    ? JSON.parse(debtorsAdjustment)
    : [];
  const debtors_adjustment = debtorsAdjustmentArray.reduce(
    (result, [debtor, weight]) => {
      result[debtor] = weight;
      if (involved_users.indexOf(debtor) === -1) {
        involved_users.push(debtor);
      }
      return result;
    },
    {}
  );

  const updatedExpenseObject = {
    description,
    split_method,
    amount,
    currency_option,
    attached_group_id,
    involved_users,
    image,
    date,
    creditors_amounts,
    debtors_weight,
    debtors_adjustment,
  };

  // Update Expense in MongoDB
  const { _id } = await updateExpense(
    expense_id,
    updatedExpenseObject,
    user_id
  );

  if (_id === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  //   Update involvedMembers into MySQL
  const updateInvolvedResult = await updateExpenseUsers(
    expense_id,
    involved_users,
    date
  );
  if (updateInvolvedResult === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  }
  return res.status(200).json({ msg: `Successfully modified expense!` });
};

const deleteGroupExpense = async (req, res, next) => {
  const user_id = req.user.id;
  const { expense_id, group_id } = req.body;
  const deleteResult = await deleteExpense(expense_id, group_id, user_id);

  // -1 means server side error, -2 means client side error (expense not found)
  if (deleteResult === -1) {
    return next(customizedError.internal("Server Error: Database Query Error"));
  } else if (deleteResult === -2) {
    return next(customizedError.badRequest("Bad Request: Expense not found"));
  }
  return res.status(200).json({ msg: "Successfully deleted!" });
};

export {
  getGroupExpenses,
  createGroupExpense,
  getExpensesCurrencies,
  updateGroupExpense,
  deleteGroupExpense,
};
