import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/user.model";
import generateToken from "../utils/generateToken";

import { IUserResponse } from "../interfaces/Response";
import { IAuthResponse } from "../interfaces/Response/AuthResponse";
import { createNotification } from "../services/notification.services";

function isPasswordStrong(password: string): { valid: boolean; message: string } {
  if (typeof password !== "string") {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password must be less than 128 characters long." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number." };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character." };
  }
 
  const commonPasswords = [
    "password", "12345678", "qwerty123", "letmein", "iloveyou",
    "admin123", "welcome1", "password1", "123456789", "abc12345",
  ];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: "This password is too common. Please choose a stronger one." };
  }
 
  return { valid: true, message: "Password is strong." };
}



export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Hitted")
    const { name, email, username, passwordHash } = req.body;
    if (!name || !email || !username || !passwordHash) {
      res.status(400).json({
        success: false,
        message: "Please provide name, email, username, and password.",
      });
      return;
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "User with this email already exists."
            : "Username is already taken.",
      });
      return;
    }
 
    const passwordCheck = isPasswordStrong(passwordHash);
    if (!passwordCheck.valid) {
      res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
      return;
    }
 
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const user = await User.create({
      name,
      email,
      username,
      passwordHash: hashedPassword,
    });
    const userResponse: IUserResponse = {
      username: user.username,
      email: user.email,
      name: user.name,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      profile_url: user.profile_url,
      cover_url: user.cover_url,
    };
    const token = generateToken({ userId: user._id.toString() });
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    const response: IAuthResponse = {
      success: true,
      message: "User registered successfully!",
      user: userResponse,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, passwordHash } = req.body;

    if (!username || !passwordHash) {
      res.status(400).json({ success: false, message: "Please provide username and password" });
      return;
    }

    const user = await User.findOne({ username }).select("+passwordHash");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid username or password" });
      return;
    }

    const token = generateToken({ userId: user._id.toString() });
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    const userResponse: IUserResponse = {
      username: user.username,
      email: user.email,
      name: user.name,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      profile_url: user.profile_url,
      cover_url: user.cover_url,
    };

    const response: IAuthResponse = {
      success: true,
      user: userResponse,
      message: "User logged in successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error occured" });
  }
};

export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
      return;
    }

    const currentUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(id);

    if (!currentUser || !userToFollow) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (currentUser._id.equals(userToFollow._id)) {
      res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
      return;
    }

    if (currentUser.following.includes(userToFollow._id)) {
      res.status(400).json({
        success: false,
        message: "Already following this user",
      });
      return;
    }

    currentUser.following.push(userToFollow._id);
    currentUser.followingCount++;

    userToFollow.followers.push(currentUser._id);
    userToFollow.followerCount++;

    await currentUser.save();
    await userToFollow.save();

    await createNotification({
      recipientId: userToFollow._id.toString(),
      senderId: currentUser._id.toString(),
      type: "follow",
      text: "started following you",
    });

    res.status(200).json({
      success: true,
      message: "User followed successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid user id" });
      return;
    }

    const userToUnfollow = await User.findById(id);

    if (!userToUnfollow) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const isFollowing = await User.exists({ _id: req.user._id, following: id });

    if (!isFollowing) {
      res.status(400).json({ success: false, message: "You are not following this user." });
      return;
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: id },
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(id, {
      $pull: { followers: req.user._id },
      $inc: { followerCount: -1 },
    });

    res.status(200).json({ success: true, message: "User unfollowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getFollowData = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user id required",
      });
    }

    const user = await User.findById(id)
      .select("followers following")
      .populate("followers", "name username profile_url")
      .populate("following", "name username profile_url")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      following: user.following,
      followers: user.followers,
    });
  } catch (error) {
    console.error("Get follow data error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const excludeIds = [...(req.user.following || []), req.user._id];

    const users = await User.find({ _id: { $nin: excludeIds } })
      .select("name username profile_url bio followerCount")
      .sort({ followerCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      users,
      message: "Recommendations fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
