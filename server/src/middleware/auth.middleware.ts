import asyncHandler from "@/utils/async-handler";
import ApiError from "@/utils/api-error";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@/utils/jwt";
import User from "@/models/users.models";
import { JwtResponse } from "@/types/auth";

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.access_token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) throw new ApiError(404, "Invalid access token");
    const decoded = verifyToken(token) as JwtResponse;
    const user = await User.findOne({ email: decoded.email });
    if (!user) throw new ApiError(404, "User not found in jwt");
    req.user = user;
    next();
  }
);
