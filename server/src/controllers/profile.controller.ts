import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import cloudinary from "../utils/cloudinary";

type UserParams = { username: string };

export const getUserProfile: RequestHandler<UserParams> = async (req, res) => {
  const { username } = req.params;

  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const user = await User.findOne({ username }).select("-passwordHash");

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  res.status(200).json({ success: true, user });
};

export const editProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { name, username, bio } = req.body;
    let { socialMedia } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        res.status(409).json({ success: false, message: "Username is already taken" });
        return;
      }
      user.username = username;
    }

    if (typeof name === "string" && name.trim()) user.name = name.trim();
    if (typeof bio === "string") user.bio = bio;

    if (socialMedia) {
      socialMedia = typeof socialMedia === "string" ? JSON.parse(socialMedia) : socialMedia;
      user.socialMedia = { ...(user.socialMedia ?? {}), ...socialMedia };
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const profileFile = files?.profile_image?.[0];
    const coverFile = files?.cover_image?.[0];

    if (profileFile) {
      const uploadResult = await cloudinary.uploader.upload(profileFile.path, {
        folder: "users/avatars",
      });
      user.profile_url = uploadResult.secure_url;
    }

    if (coverFile) {
      const uploadResult = await cloudinary.uploader.upload(coverFile.path, {
        folder: "users/covers",
      });
      user.cover_url = uploadResult.secure_url;
    }

    await user.save();

    const safeUser = user.toObject() as any;
    delete safeUser.passwordHash;

    res.status(200).json({
      success: true,
      user: safeUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
      return;
    }

    if (String(newPassword).length < 6) {
      res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
      return;
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: "Current password is incorrect" });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    await User.findByIdAndDelete(req.user._id);

    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
