import mongoose, { Document, Schema, model } from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";
export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}
const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: thirtyDaysFromNow,
  },
});

export const SessionModal = model<SessionDocument>(
  "SessionModal",
  sessionSchema
);
