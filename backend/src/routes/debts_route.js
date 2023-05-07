import express from "express";
const router = express.Router();
import { wrapAsync, authentication } from "../utils/util.js";

import {
    getGroupDebts,
    getSettlingGroupDebts,
    settleUpDebts,
    notifyUserDebt,
} from "../controllers/debts_controller.js";

/* GET debts data */
router
    .route("/debts/:group_id")
    .get(authentication(), wrapAsync(getGroupDebts))
    .post(authentication(), wrapAsync(settleUpDebts));

router.route("/debts/:group_id/settling").get(wrapAsync(getSettlingGroupDebts));

router
    .route("/debts/:group_id/notification")
    .post(authentication(), wrapAsync(notifyUserDebt));

export default router;
