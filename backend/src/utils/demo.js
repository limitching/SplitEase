import { mongoose, pool } from "./db.js";
import { Expense, updateExpense } from "../models/expense_model.js";

const softDrinkExpense = {
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

// Recover data from the demo database
const restoreExpense = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Deleting existing data...");
    await Expense.deleteMany(
      {
        _id: { $nin: ["64673dfc2e2a59a032093f1b", "64673db42e2a59a032093f13", "64673d712e2a59a032093f0b"] },
        attached_group_id: "32"
      },
      { session }
    );
    console.log("Restoring demo data...");
    // Update Expense in MongoDB _id:64673dfc2e2a59a032093f1b
    await updateExpense("64673dfc2e2a59a032093f1b", softDrinkExpense, 61);
    await updateExpense("64673db42e2a59a032093f13", BiscuitsExpense, 60);
    await updateExpense("64673d712e2a59a032093f0b", BeerExpense, 61);
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
    console.log("Remove settlements complete!");
  } catch (error) {
    console.error(error);
  }
};
const removeLogs = async () => {
  try {
    await pool.query("DELETE FROM logs WHERE id > 642 && group_id = 32");
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
