import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/util.js";
import {
    getGroupInformation,
    getGroupMembers,
} from "../controllers/group_controller.js";

/* GET expense data */
router.route("/group/:group_id").get(wrapAsync(getGroupInformation));

router.route("/group/members/:group_id").get(wrapAsync(getGroupMembers));

export default router;
