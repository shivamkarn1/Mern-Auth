import { SessionModal } from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK } from "../constants/http";
import { z } from "zod";
import appAssert from "../utils/appAssert";
import mongoose from "mongoose";

const getSessionHandler = catchErrors(async (req, res) => {
  const sessions = await SessionModal.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );
  return res.status(OK).json({
    sessions: sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && { isCurrent: true }),
    })),
  });
});

const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);

  // Validate that the sessionId is a valid MongoDB ObjectId
  appAssert(
    mongoose.Types.ObjectId.isValid(sessionId),
    BAD_REQUEST,
    "Invalid session ID format"
  );

  const deleted = await SessionModal.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");

  return res.status(OK).json({
    message: "Session Removed",
  });
});

export { getSessionHandler, deleteSessionHandler };
