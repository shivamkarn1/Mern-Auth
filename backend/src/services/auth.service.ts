import VerificationCodeType from "../constants/verificationCodeType";
import { User } from "../models/user.model";
import { oneYearFromNow } from "../utils/date";
import { VerificationModel } from "../models/verificationCode.model";

export type createAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const createAccount = async (data: createAccountParams) => {
  // check if user already exists
  const existingUser = await User.exists({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("User Already Exists");
  }
  // create user
  const user = await User.create({
    email: data.email,
    password: data.password,
  });
  if (!user) {
    throw new Error("Failed to Register User.");
  }
  // create verification code
  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });
  // send verification email

  // create session

  // sign access token and refresh token
  // return user & tokens
};
