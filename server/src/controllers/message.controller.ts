import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

// GET /api/chat/conversations — list of this user's conversations
export const getConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name username profile_url")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/chat/conversations  { recipientId } — find or create a 1:1 conversation
export const getOrCreateConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { recipientId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    if (!recipientId) {
      res.status(400).json({ success: false, message: "recipientId is required" });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId], $size: 2 },
    }).populate("participants", "name username profile_url");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, recipientId],
      });
      conversation = await conversation.populate(
        "participants",
        "name username profile_url"
      );
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/chat/conversations/:conversationId/messages — message history
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name username profile_url")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};