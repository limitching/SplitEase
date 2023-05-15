import { check, validationResult } from "express-validator";
import validator from "validator";

export default [
  check("owner")
    .exists()
    .withMessage("owner are required.")
    .bail()
    .notEmpty()
    .withMessage("owner are required.")
    .isNumeric()
    .withMessage("owner should be user_id.")
    .bail(),
  check("name")
    .exists()
    .withMessage("group name are required.")
    .bail()
    .notEmpty()
    .withMessage("group name are required.")
    .bail()
    .trim()
    .custom((value) => {
      if (validator.isEmpty(value.trim())) {
        throw new Error("name cannot be all space");
      }
      return true;
    })
    .withMessage("name cannot be all space"),
  check("default_currency")
    .exists()
    .withMessage("default_currency are required.")
    .bail()
    .notEmpty()
    .withMessage("default_currency are required.")
    .isNumeric()
    .withMessage("default_currency should be currency_option_id.")
    .bail(),
  check("slug")
    .if((value, { req }) => req.body.slug !== undefined)
    .notEmpty()
    .withMessage("slug cannot be empty.")
    .isString()
    .withMessage("slug should be a string.")
    .isLength({ min: 4, max: 16 })
    .withMessage("slug length should be between 4 - 16."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
