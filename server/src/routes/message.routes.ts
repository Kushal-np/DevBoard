import { Router } from "express";

import { authMiddleware} from "../middleware/auth.middleware"; // whatever your auth middleware is called
import { getConversations, getMessages, getOrCreateConversation } from "../controllers/message.controller";

const router = Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/conversations", authMiddleware, getOrCreateConversation);
router.get("/conversations/:conversationId/messages", authMiddleware, getMessages);

export default router;