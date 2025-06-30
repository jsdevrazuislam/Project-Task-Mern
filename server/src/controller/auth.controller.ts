import asyncHandler from "@/utils/async-handler";
import { Request, Response } from "express";
import User from "@/models/users.models";
import ApiError from "@/utils/api-error";
import { generateToken } from "@/utils/jwt";
import ApiResponse from "@/utils/api-response";
import { TOKEN } from "@/constants";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, photoURL } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, "Email already in use");
  const user = await User.create({ name, email, password, photoURL });

  const token = generateToken(user);

  return res
    .cookie(TOKEN, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, { user, token }, "Register Successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(400, "Invalid credentials");

  const token = generateToken(user);

  return res
    .cookie(TOKEN, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, {user, token}, "Login Successfully"));
});

export const logout = asyncHandler(async(req: Request, res: Response) => {
    return res
    .clearCookie(TOKEN)
    .json(new ApiResponse(200, null, "Logged out successfully"))
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user.email });

  if (!user) throw new ApiError(404, "Not found user");

  return res.json(new ApiResponse(200, user, "Fetching User Success"));
});