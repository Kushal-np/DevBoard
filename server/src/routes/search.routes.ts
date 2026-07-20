import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { searchUsers, searchPosts, searchByTag } from "../controllers/search.controller";

const router = express.Router();

router.get("/users", authMiddleware, searchUsers);
router.get("/posts", authMiddleware, searchPosts);
router.get("/tags", authMiddleware, searchByTag);

export default router;
