import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

interface UserParams {
  username: string;
}

export const getUserProfile = async (
  req: AuthRequest<UserParams>,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

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
      message: "User found successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};