import multer from "multer";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const { TOKEN_SECRET } = process.env;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: __dirname + "/../../.env" });

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

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

const authentication = (req, res, next) => {
  return async function (req, res, next) {
    let accessToken = req.get("Authorization");
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    accessToken = accessToken.replace("Bearer ", "");
    if (accessToken == "null") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const user = jwt.verify(accessToken, TOKEN_SECRET);
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error: "Forbidden" });
    }
  };
};
export { normalizePort, wrapAsync, multerUpload, authentication };
