import { NOT_FOUND, OK } from "../constants/http";
import { User } from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

const getUserHandler = catchErrors(async (req, res) => {
  // fetch users from db
  const user = await User.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not Found / Doesn't exist");
  return res.status(OK).json(user.omitPassword());
});

export { getUserHandler };
