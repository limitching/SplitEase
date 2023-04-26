import { check, validationResult } from "express-validator";

export default [
    check("name")
        .exists()
        .withMessage("name are required.")
        .bail()
        .notEmpty()
        .withMessage("name cannot be empty.")
        .bail(),
    check("image")
        .exists()
        .withMessage("image url are required.")
        .bail()
        .if((value, { req }) => req.body.image !== null)
        .notEmpty()
        .withMessage("image url cannot be empty.")
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
