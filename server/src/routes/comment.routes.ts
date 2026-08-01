import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createComment, getComments, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.post("/:projectId", authMiddleware, createComment);
router.get("/:projectId", getComments);
router.delete("/:id", authMiddleware, deleteComment);

export default router;