import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ISocialMedia } from "../interfaces/dbModels/user.interface.models";
import { IJWTPayload } from "../interfaces/Response/Jwt";
import User from "../models/user.model";
import {RequestHandler} from "express";



export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as IJWTPayload;

  const user = await User.findById(decoded.userId);

  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  req.user = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    followers: user.followers,
    following: user.following,
    bio: user.bio,
    profile_url: user.profile_url,
    cover_url: user.cover_url,
  };

  next();
};