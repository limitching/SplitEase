import express from "express";
const router = express.Router();
import { wrapAsync } from "../utils/util.js";
import {
    getGroupInformation,
    archiveExistingGroup,
    getGroupMembers,
    createNewGroup,
    getPublicInformation,
    joinGroup,
    editExistingGroup,
} from "../controllers/group_controller.js";
import { authentication } from "../utils/util.js";
import createGroupValidator from "../middlewares/validators/createGroupValidator.js";
import editGroupValidator from "../middlewares/validators/editGroupValidator.js";

/* GET expense data */
router
    .route("/group/:group_id")
    .get(wrapAsync(getGroupInformation))
    .put(wrapAsync(archiveExistingGroup));

router.route("/group/members/:group_id").get(wrapAsync(getGroupMembers));

router
    .route("/group")
    .post(authentication(), createGroupValidator, wrapAsync(createNewGroup))
    .put(authentication(), editGroupValidator, wrapAsync(editExistingGroup));

/* Join the Group via Invitation */
router
    .route("/group/:slug/join")
    .get(wrapAsync(getPublicInformation))
    .post(authentication(), wrapAsync(joinGroup));

export default router;
