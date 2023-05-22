import { mongoose, pool } from "./db.js";
import { Expense, updateExpense } from "../models/expense_model.js";

const softDrinkExpense = {
  _id: "64673dfc2e2a59a032093f1b",
  amount: 100,
  attached_group_id: "32",
  description: "Soft Drink",
  split_method: "split equally",
  currency_option: 1,
  involved_users: [59, 60],
  image: null,
  status: "unsettled",
  date: "2023-05-01T09:13:00.000Z",
  creditors_amounts: { 59: 100 },
  debtors_weight: { 59: 1, 60: 1 },
  debtors_adjustment: {}
};
const BiscuitsExpense = {
  _id: "64673db42e2a59a032093f13",
  amount: 160,
  attached_group_id: "32",
  description: "Biscuits",
  split_method: "split equally",
  currency_option: 1,
  involved_users: [60, 61],
  image: null,
  status: "unsettled",
  date: "2023-05-02T09:12:00.000Z",
  creditors_amounts: { 60: 160 },
  debtors_weight: { 60: 1, 61: 1 },
  debtors_adjustment: {}
};
const BeerExpense = {
  _id: "64673d712e2a59a032093f0b",
  amount: 200,
  attached_group_id: "32",
  description: "Beer",
  split_method: "split equally",
  currency_option: 1,
  involved_users: [59, 61],
  image: null,
  status: "unsettled",
  date: "2023-05-03T09:11:00.000Z",
  creditors_amounts: { 59: 200 },
  debtors_weight: { 59: 1, 61: 1 },
  debtors_adjustment: {}
};

const expensesIn3PersonGroup = [{ ...softDrinkExpense }, { ...BiscuitsExpense }, { ...BeerExpense }];

const expensesInSandBoxGroup = [
  {
    _id: "646adca38b95b7454e31cc97",
    description: "Birthday cake",
    amount: 1200,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      59: 1200
    },
    debtors_weight: {
      59: 1,
      60: 1,
      61: 1,
      64: 1,
      65: 1,
      66: 1,
      67: 1,
      68: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [59, 61, 64, 65, 66, 67, 68, 60],
    status: "unsettled",
    date: "2023-05-22T03:07:00.000Z",
    image: null,
    createTime: "2023-05-22T03:08:19.916Z"
  },
  {
    _id: "646addab8b95b7454e31cc9f",
    description: "Pork (Costco)",
    amount: 800,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      65: 800
    },
    debtors_weight: {
      59: 1,
      60: 1,
      61: 1,
      64: 1,
      68: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [65, 59, 60, 61, 68, 64],
    status: "unsettled",
    date: "2023-05-22T03:12:00.000Z",
    image: null,
    createTime: "2023-05-22T03:12:43.265Z"
  },
  {
    _id: "646ade1f8b95b7454e31ccae",
    description: "Cookies ",
    amount: 100,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      66: 100
    },
    debtors_weight: {
      60: 1,
      61: 1,
      65: 1,
      67: 1,
      68: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [66, 61, 65, 60, 68, 67],
    status: "unsettled",
    date: "2023-05-22T03:13:00.000Z",
    image: null,
    createTime: "2023-05-22T03:14:39.867Z"
  },
  {
    _id: "646ae7df8b95b7454e31ccf2",
    description: "Parking fee",
    amount: 300,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      68: 300
    },
    debtors_weight: {
      60: 1,
      61: 1,
      64: 1,
      65: 1,
      67: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [68, 60, 61, 65, 67, 64],
    status: "unsettled",
    date: "2023-05-22T03:55:00.000Z",
    image: null,
    createTime: "2023-05-22T03:56:15.146Z"
  },
  {
    _id: "646ae8488b95b7454e31ccfb",
    description: "Salads",
    amount: 600,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      64: 600
    },
    debtors_weight: {
      59: 1,
      60: 1,
      61: 1,
      64: 1,
      65: 1,
      66: 1,
      67: 1,
      68: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [64, 59, 60, 61, 64, 65, 66, 67, 68],
    status: "unsettled",
    date: "2023-05-22T03:56:00.000Z",
    image: null,
    createTime: "2023-05-22T03:58:00.078Z"
  },
  {
    _id: "646ae94a8b95b7454e31cd06",
    description: "Alcohol",
    amount: 1120,
    currency_option: 1,
    split_method: "split by exact amounts",
    creditors_amounts: {
      59: 0,
      60: 465,
      61: 350,
      64: 0,
      65: 0,
      66: 0,
      67: 305,
      68: 0
    },
    debtors_weight: {
      59: 815,
      65: 305
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [59, 60, 61, 64, 65, 66, 67, 68],
    status: "unsettled",
    date: "2023-05-13T03:59:00.000Z",
    image: null,
    createTime: "2023-05-22T04:02:18.054Z"
  },
  {
    _id: "646ae9d18b95b7454e31cd15",
    description: "Chocolate",
    amount: 80,
    currency_option: 1,
    split_method: "split equally",
    creditors_amounts: {
      66: 80
    },
    debtors_weight: {
      64: 1,
      66: 1
    },
    debtors_adjustment: {},
    attached_group_id: "38",
    involved_users: [66, 64],
    status: "unsettled",
    date: "2023-05-21T04:03:00.000Z",
    image: null,
    createTime: "2023-05-22T04:04:33.371Z"
  }
];

// Recover data from the demo database
const restoreExpense = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Deleting existing data...");
    // delete all expenses in group 32
    await Expense.deleteMany(
      {
        attached_group_id: "32"
      },
      { session }
    );
    await Expense.deleteMany(
      {
        attached_group_id: "38"
      },
      { session }
    );
    console.log("Restoring demo data...");
    // insert demo data into group 32
    await Expense.create(expensesIn3PersonGroup, { session });
    await Expense.create(expensesInSandBoxGroup, { session });
    await session.commitTransaction();
    console.log("Update complete!");
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
  } finally {
    session.endSession();
  }
};
const removeSettling = async () => {
  try {
    await pool.query("DELETE FROM settlements WHERE group_id = 32");
    await pool.query("DELETE FROM settlements WHERE group_id = 38");
    console.log("Remove settlements complete!");
  } catch (error) {
    console.error(error);
  }
};
const removeLogs = async () => {
  try {
    await pool.query("DELETE FROM logs WHERE id > 642 && group_id = 32");
    await pool.query("DELETE FROM logs WHERE id > 670 && group_id = 38");
    console.log("Remove logs complete!");
  } catch (error) {
    console.error(error);
  }
};
const restoreDemo = async () => {
  await restoreExpense();
  await removeSettling();
  await removeLogs();
};

restoreDemo();
