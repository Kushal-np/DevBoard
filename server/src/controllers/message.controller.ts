import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import mongoose from "mongoose";

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


export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { conversationId } = req.params;

    if (
      !conversationId ||
      Array.isArray(conversationId) ||
      !mongoose.Types.ObjectId.isValid(conversationId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid conversationId",
      });
      return;
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
      return;
    }

    const messages = await Message.find({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    })
      .populate("senderId", "name username profile_url")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getConversationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    if (
      !conversationId ||
      !mongoose.Types.ObjectId.isValid(conversationId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid conversationId",
      });
      return;
    }

    const conversation = await Conversation.findById(conversationId).populate(
      "participants",
      "name username profile_url"
    );

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    const isParticipant = conversation.participants.some((participant: any) => {
      return participant._id.toString() === userId.toString();
    });

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: "Not a participant",
      });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};