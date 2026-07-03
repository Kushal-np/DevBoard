import express from "express";
import {Router} from "express";
import upload from "../middleware/upload.middleware";
import { createPost } from "../controllers/project.controller";
const router = express.Router();

router.post("/create-post" , upload.single("thumbnail") , createPost);

export default router;