import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/util.js";
import {
    getGroupDebts,
    getSettlingGroupDebts,
} from "../controllers/debts_controller.js";

/* GET debts data */
router.route("/debts/:group_id").get(wrapAsync(getGroupDebts));

router.route("/debts/:group_id/settling").get(wrapAsync(getSettlingGroupDebts));

export default router;
