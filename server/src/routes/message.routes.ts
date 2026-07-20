import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from "../controllers/message.controller";

const router = express.Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations/:userId", authMiddleware, startConversation);
router.get("/:conversationId", authMiddleware, getMessages);
router.post("/:conversationId", authMiddleware, sendMessage);

export default router;
