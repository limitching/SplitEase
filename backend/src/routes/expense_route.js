import express from "express";
const router = express.Router();
import wrapAsync from "../utils/util.js";
import {
    getGroupExpenses,
    createGroupExpense,
} from "../controllers/expense_controller.js";

/* GET expense data */
router
    .route("/expense")
    .get(wrapAsync(getGroupExpenses))
    .post(wrapAsync(createGroupExpense));

export default router;
