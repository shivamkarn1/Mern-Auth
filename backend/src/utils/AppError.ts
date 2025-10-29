import { httpStatusCode } from "../constants/http.js";

import { AppErrorCode } from "../constants/appErrorCode.js";

class AppError extends Error {
  constructor(
    public statusCode: httpStatusCode,
    public message: string,
    public errorCode?: string
  ) {
    super(message);
  }
}

export { AppError };
