import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const encodedAccessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!encodedAccessToken) throw new ApiError(401, "Unauthorized access 1");

    const decodedAccessToken = jwt.verify(
      encodedAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedAccessToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Unauthorized access 2");

    req.user = user;
    next();

  } catch (error) {
    throw error instanceof ApiError ? error :  new ApiError(401, "Unauthorized access 3");
  }
});
