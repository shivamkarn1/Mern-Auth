/* Asserts a condition and throws an AppError if the condition is falsy */
import { AppError } from "./AppError";
import { httpStatusCode } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";

type AppAssert = (
  condition: any,
  httpStatusCode: httpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => {
  if (!condition) throw new AppError(httpStatusCode, message, appErrorCode);
};

export default appAssert;
