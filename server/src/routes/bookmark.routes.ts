import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { bookmarkPost, getBookmarkPosts, deleteFromBookmarks } from "../controllers/bookmark.controller";

const router = express.Router();

router.get("/", authMiddleware, getBookmarkPosts);
router.post("/:id", authMiddleware, bookmarkPost);
router.delete("/:id", authMiddleware, deleteFromBookmarks);

export default router;
