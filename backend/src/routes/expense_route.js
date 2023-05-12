import express from "express";
const router = express.Router();
import { wrapAsync, multerUpload } from "../utils/util.js";
const expenseUpload = multerUpload.single("image");
import {
  getGroupExpenses,
  createGroupExpense,
  getExpensesCurrencies,
  updateGroupExpense,
  deleteGroupExpense,
} from "../controllers/expense_controller.js";
import expenseValidator from "../middlewares/validators/expenseValidator.js";
import { authentication } from "../utils/util.js";

/* Expense API */
router
  .route("/expense")
  .get(authentication(), wrapAsync(getGroupExpenses))
  .post(
    authentication(),
    expenseUpload,
    expenseValidator,
    wrapAsync(createGroupExpense)
  )
  .put(
    authentication(),
    expenseUpload,
    expenseValidator,
    wrapAsync(updateGroupExpense)
  )
  .delete(authentication(), wrapAsync(deleteGroupExpense));

/* Currencies API */
router.route("/currencies").get(wrapAsync(getExpensesCurrencies));

export default router;
