import { check, validationResult } from "express-validator";

export default [
    check("name")
        .exists()
        .withMessage("Request Error: name, email and password are required.")
        .bail()
        .notEmpty()
        .withMessage("Request Error: name, email and password are required.")
        .bail(),
    check("email")
        .exists()
        .withMessage("Request Error: name, email and password are required.")
        .bail()
        .notEmpty()
        .withMessage("Request Error: name, email and password are required.")
        .bail()
        .isEmail()
        .withMessage("Request Error: Invalid email format")
        .bail(),
    check("password")
        .exists()
        .withMessage("Request Error: name, email and password are required.")
        .isLength({ min: 4, max: 16 })
        .withMessage("Request Error: password length should be between 8 - 16")
        .custom((value) => {
            const pwdregex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{4,16}$/;
            if (!value.match(pwdregex)) {
                throw new Error(
                    "Request Error: password should be at least one lowercase, one uppercase, one digit, one special character"
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
