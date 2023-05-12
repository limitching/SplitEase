import { check, validationResult } from "express-validator";

export default [
  check("provider").exists().withMessage("provider is required."),
  check("email")
    .if((value, { req }) => req.body.provider === "native")
    .exists()
    .withMessage("email is required.")
    .bail()
    .notEmpty()
    .withMessage("email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  check("password")
    .if((value, { req }) => req.body.provider === "native")
    .exists()
    .withMessage("password is required.")
    .isLength({ min: 4, max: 16 })
    .withMessage("password length should be between 8 - 16")
    .custom((value) => {
      const pwdregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{4,16}$/;
      if (!value.match(pwdregex)) {
        throw new Error(
          "password should be at least one lowercase, one uppercase, one digit, one special character"
        );
      } else {
        return true;
      }
    })
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
