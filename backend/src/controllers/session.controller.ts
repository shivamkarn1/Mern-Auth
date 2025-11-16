import { SessionModal } from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import { NOT_FOUND, OK } from "../constants/http";
import { z } from "zod";
import appAssert from "../utils/appAssert";

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

  const deleted = await SessionModal.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, " Session Not Found");

  return res.status(OK).json({
    message: "Session Removed",
  });
});

export { getSessionHandler, deleteSessionHandler };
