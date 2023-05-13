class customizedError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message || "Internal Server Error";
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(message) {
    return new customizedError(message ? message : "Bad Request", 400);
  }
  static unauthorized(message) {
    return new customizedError(message || "Unauthorized", 401);
  }
  static forbidden(message) {
    return new customizedError(message || "Forbidden", 403);
  }
  static notFound(message) {
    return new customizedError(message || "Not Found", 404);
  }
  static tooManyRequests(message) {
    return new customizedError(message || "Too Many Requests", 429);
  }
  static internal(message) {
    return new customizedError(message || "Internal Server Error", 500);
  }
}

export { customizedError };
