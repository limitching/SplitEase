import multer from "multer";
import path from "path";
import { v4 as uuidV4 } from "uuid";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let assetsPath = path.join(__dirname, `../../public/assets/`);
            if (req.path === "/expense") {
                assetsPath += "expenses/";
            } else if (req.path === "/user") {
                assetsPath += "users/";
            }
            cb(null, assetsPath);
        },
        filename: (req, file, cb) => {
            const customFileName = uuidV4();
            const fileExtension = file.mimetype.split("/")[1]; // get file extension from original file name
            cb(null, customFileName + "." + fileExtension);
        },
    }),
});
export { wrapAsync, multerUpload };
