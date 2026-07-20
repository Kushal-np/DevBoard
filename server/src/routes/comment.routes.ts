import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addComment, getComments, deleteComment } from "../controllers/comment.controller";

const router = express.Router();

router.get("/:projectId", authMiddleware, getComments);
router.post("/:projectId", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
