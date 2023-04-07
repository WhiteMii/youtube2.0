export default class ApiError extends Error {
  status;
  message;
  errors;

  constructor(status, message, errors = []) {
    super(`${status}: ${message}`);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "User isn't authorized");
  }

  static BadRequest(message, status = 400, errors = []) {
    return new ApiError(status, message, errors);
  }
}
