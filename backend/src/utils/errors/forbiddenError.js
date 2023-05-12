import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customAPIError.js";

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
