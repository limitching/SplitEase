import express from "express";
import {
  signUp,
  signIn,
  getUserGroups,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user_controller.js";
import signUpValidator from "../middlewares/validators/signUpValidator.js";
import signInValidator from "../middlewares/validators/signInValidator.js";
import updateProfileValidator from "../middlewares/validators/updateProfileValidator.js";
var router = express.Router();

import { wrapAsync, authentication } from "../utils/util.js";

/* User SignUp */
router.route("/user/signup").post(signUpValidator, wrapAsync(signUp));
/* User SignIn */
router.route("/user/signin").post(signInValidator, wrapAsync(signIn));
/* User Get User Group */
router.route("/user/groups").get(authentication(), wrapAsync(getUserGroups));
/* User Profile */
router
  .route("/user/profile")
  .get(authentication(), wrapAsync(getUserProfile))
  .post(authentication(), updateProfileValidator, wrapAsync(updateUserProfile));

export default router;
