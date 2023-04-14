import express from "express";
import { signUp } from "../controllers/user_controller.js";
import expenseValidator from "../middlewares/validators/signUpValidator.js";
var router = express.Router();

import { wrapAsync } from "../utils/util.js";

/* User SignUp */
router.route("/user/signup").post(expenseValidator, wrapAsync(signUp));

export default router;
