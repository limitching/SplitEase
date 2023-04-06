import express from "express";
const router = express.Router();
import { wrapAsync, multerUpload } from "../utils/util.js";
const expenseUpload = multerUpload.single("image");
import {
    getGroupExpenses,
    createGroupExpense,
    getExpensesCurrencies,
} from "../controllers/expense_controller.js";
import expenseValidator from "../middlewares/validators/expenseValidator.js";

/* Expense API */
router
    .route("/expense")
    .get(wrapAsync(getGroupExpenses))
    .post(expenseUpload, expenseValidator, wrapAsync(createGroupExpense));

/* Currencies API */
router.route("/currencies").get(wrapAsync(getExpensesCurrencies));

export default router;
