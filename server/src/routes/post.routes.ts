import express from "express";
import upload from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createPost,
  getPostsFeed,
  getPostsByUser,
  likePost,
  getLikedPosts,
} from "../controllers/post.controller";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/feed", authMiddleware, getPostsFeed);
router.get("/user/:userId", authMiddleware, getPostsByUser);
router.post("/:id/like", authMiddleware, likePost);
router.get("/liked" , authMiddleware , getLikedPosts)
export default router;