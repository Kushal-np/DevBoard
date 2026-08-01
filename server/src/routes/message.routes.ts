import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getConversations,
  getMessages,
  getOrCreateConversation,
  getConversationById,
} from "../controllers/message.controller";

const router = Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations", authMiddleware, getOrCreateConversation);
router.get("/conversations/:conversationId", authMiddleware, getConversationById);
router.get("/conversations/:conversationId/messages", authMiddleware, getMessages);

export default router;