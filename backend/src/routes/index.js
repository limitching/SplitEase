import express from "express";
var router = express.Router();

/* Health check page for AWS ELB. */
router.get("/", function (req, res, next) {
    return res.status(200);
});

export default router;
