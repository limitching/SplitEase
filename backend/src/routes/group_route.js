import express from "express";
const router = express.Router();
import wrapAsync from "../utils/util.js";
import {
    getGroupInformation,
    getGroupMembers,
} from "../controllers/group_controller.js";

/* GET expense data */
router.route("/group/:gid").get(wrapAsync(getGroupInformation));

router.route("/group/:gid/members").get(wrapAsync(getGroupMembers));

export default router;
