import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user.model";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

// Rule: you can only start/message a conversation with someone who
// follows you AND who you follow back (mutual follow).
const isMutualFollow = async (userAId: string, userBId: string) => {
  const userA = await User.findById(userAId).select("followers following");
  if (!userA) return false;
  const followsB = userA.following.some((id) => id.equals(userBId));
  const followedByB = userA.followers.some((id) => id.equals(userBId));
  return followsB && followedByB;
};

// GET /api/message/conversations
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const conversations = await Conversation.find({ participants: req.user._id })
      .populate("participants", "name username profile_url")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, conversations, message: "Conversations fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/message/conversations/:userId  -> get-or-create a conversation with a mutual follow
export const startConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { userId } = req.params;

    if (userId === req.user._id) {
      res.status(400).json({ success: false, message: "Cannot message yourself" });
      return;
    }

    const mutual = await isMutualFollow(req.user._id, userId);
    if (!mutual) {
      res.status(403).json({
        success: false,
        message: "You can only message users who follow you and you follow back",
      });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [new Types.ObjectId(req.user._id), new Types.ObjectId(userId)],
      });
    }

    res.status(200).json({ success: true, conversation, message: "Conversation ready" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/message/:conversationId
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages, message: "Messages fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/message/:conversationId  -> REST fallback; real-time send happens over socket
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Message text is required" });
      return;
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
