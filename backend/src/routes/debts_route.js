import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/util.js";
import { getGroupDebts } from "../controllers/debts_controller.js";

/* GET debts data */
router.route("/debts/:gid").get(wrapAsync(getGroupDebts));

export default router;
