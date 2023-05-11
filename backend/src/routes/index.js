import express from "express";
import generateUploadUrl from "../services/S3.js";
import { wrapAsync, authentication } from "../utils/util.js";
const router = express.Router();

/* Health check page for AWS ELB. */
router.get("/", function (req, res) {
    return res.status(200);
});

router.route("/s3url").get(
    authentication(),
    wrapAsync(async (req, res) => {
        try {
            const { url, imageName } = await generateUploadUrl();
            return res.status(200).json({ url, imageName });
        } catch (error) {
            return res.status(500).json({ error });
        }
    })
);

export default router;
