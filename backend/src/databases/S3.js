import aws from "aws-sdk";

import dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });
const {
    AWS_S3_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
} = process.env;

const region = AWS_S3_REGION;
const bucketName = AWS_S3_BUCKET_NAME;
const accessKeyId = AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = AWS_S3_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "4",
});

export async function generateUploadUrl() {
    const imageName = "random image name";

    const params = { Bucket: bucketName, Key: imageName, Expires: 60 };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    return uploadURL;
}
