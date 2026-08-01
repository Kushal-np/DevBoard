import express from "express";
import upload from "../middleware/upload.middleware";
import {
  createPost,
  getFeed,
  getPosts,
  getPostsById,
  getStarredPost,
  starPost,
  getProjectsByUser,
  getFeaturedPosts,
  getExplorePosts,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/create-post", authMiddleware, upload.single("thumbnail"), createPost);
router.get("/get-post", authMiddleware, getPosts);
router.get("/get-post/:id", authMiddleware, getPostsById);
router.get("/getFeed", authMiddleware, getFeed);
router.post("/:id/star", authMiddleware, starPost);
router.get("/star", authMiddleware, getStarredPost);
router.get("/featured", authMiddleware, getFeaturedPosts);
router.get("/explore", authMiddleware, getExplorePosts);
router.get("/user/:userId", authMiddleware, getProjectsByUser);

export default router;