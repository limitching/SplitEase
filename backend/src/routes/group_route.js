import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/util.js";
import {
    getGroupInformation,
    getGroupMembers,
    createNewGroup,
} from "../controllers/group_controller.js";
import { authentication } from "../utils/util.js";
import createGroupValidator from "../middlewares/validators/createGroupValidator.js";

/* GET expense data */
router.route("/group/:group_id").get(wrapAsync(getGroupInformation));

router.route("/group/members/:group_id").get(wrapAsync(getGroupMembers));

router
    .route("/group")
    .post(authentication(), createGroupValidator, wrapAsync(createNewGroup));

export default router;
