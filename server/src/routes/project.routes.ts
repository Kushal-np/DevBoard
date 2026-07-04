import express from "express";
import {Router} from "express";
import upload from "../middleware/upload.middleware";
import { createPost, getPosts, getPostsById } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/create-post" ,authMiddleware, upload.single("thumbnail") , createPost);
router.get("/get-post" , authMiddleware , getPosts);
router.get("/get-post/:id" , authMiddleware , getPostsById);
router.get("/getFeed" , authMiddleware , )
export default router;