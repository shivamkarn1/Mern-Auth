import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { hashValue, compareValue } from "../utils/bcrypt";
export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: { type: String, required: [true, "Password is required"] },
    verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (
  userEnteredPassword: string
) {
  return compareValue(userEnteredPassword, this.password);
};

export const User = model<UserDocument>("User", userSchema);
