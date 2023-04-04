import express from "express";
const router = express.Router();
import wrapAsync from "../utils/util.js";
import {
    getGroupExpenses,
    createGroupExpense,
    getExpensesCurrencies,
} from "../controllers/expense_controller.js";

/* Expense API */
router
    .route("/expense")
    .get(wrapAsync(getGroupExpenses))
    .post(wrapAsync(createGroupExpense));

/* Currencies API */
router.route("/currencies").get(wrapAsync(getExpensesCurrencies));

export default router;
