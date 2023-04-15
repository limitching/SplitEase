import express from "express";
import { signUp, signIn } from "../controllers/user_controller.js";
import signUpValidator from "../middlewares/validators/signUpValidator.js";
import signInValidator from "../middlewares/validators/signInValidator.js";
var router = express.Router();

import { wrapAsync } from "../utils/util.js";

/* User SignUp */
router.route("/user/signup").post(signUpValidator, wrapAsync(signUp));
router.route("/user/signin").post(signInValidator, wrapAsync(signIn));

export default router;
