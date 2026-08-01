import { Request, Response } from "express";
import Notification from "../models/notification.model";

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const notifications = await Notification.find({ recipientId: userId })
      .populate("senderId", "name username profile_url")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      read: false,
    });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({ success: false, message: "Notification id is required" });
      return;
    }

    await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { read: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};