import express from "express";
const router = express.Router();
import { wrapAsync, authentication } from "../utils/util.js";

import {
    getGroupDebts,
    getSettlingGroupDebts,
    settleUpDebts,
} from "../controllers/debts_controller.js";

/* GET debts data */
router
    .route("/debts/:group_id")
    .get(authentication(), wrapAsync(getGroupDebts))
    .post(authentication(), wrapAsync(settleUpDebts));

router.route("/debts/:group_id/settling").get(wrapAsync(getSettlingGroupDebts));

export default router;
