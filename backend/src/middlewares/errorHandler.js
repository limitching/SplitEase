import { StatusCodes } from "http-status-codes";

const defaultErrorHandler = (err, req, res, next) => {
  console.error(err);

  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Internal Server Error",
  };

  return res
    .status(customError.statusCode)
    .json({ error: customError.message });
};
export default defaultErrorHandler;
