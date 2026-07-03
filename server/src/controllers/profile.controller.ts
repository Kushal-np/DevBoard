import { Request, Response } from "express";
import User from "../models/user.model";
import { RequestHandler } from "express";

type UserParams = {
  username: string;
}

export const getUserProfile: RequestHandler<UserParams> = async (
  req,
  res
) => {
  const { username } = req.params; 

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const user = await User.findOne({ username }).select("-passwordHash");

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
};