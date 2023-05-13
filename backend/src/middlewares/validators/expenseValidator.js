import { check, validationResult } from "express-validator";

export default [
  check("amount")
    .exists()
    .withMessage("Expense amount not exist")
    .bail()
    .notEmpty()
    .withMessage("Expense amount cannot be empty")
    .bail()
    .isNumeric()
    .withMessage("Expense amount should be number")
    .bail(),
  check("split_method")
    .exists()
    .withMessage("split_method not exist")
    .bail()
    .notEmpty()
    .withMessage("split_method cannot be empty")
    .bail()
    .isString()
    .withMessage("split_method should be string")
    .bail(),
  check("date")
    .exists()
    .notEmpty()
    .withMessage("date cannot be empty")
    .isISO8601("yyyy-mm-dd")
    .withMessage("date must be in correct format yyyy:mm:dd hh:mm:ss"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
