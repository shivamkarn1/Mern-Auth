import { resourceLimits } from "worker_threads";
import { SessionModal } from "../models/session.model";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";

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

export { getSessionHandler };
