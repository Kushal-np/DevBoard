import express from "express";
import {Router} from "express";
import upload from "../middleware/upload.middleware";
import { createPost } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/create-post" ,authMiddleware, upload.single("thumbnail") , createPost);

export default router;