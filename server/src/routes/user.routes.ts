import express from "express";
import { Router } from "express";
import {
  followUser,
  getFollowData,
  getMe,
  login,
  logout,
  register,
  unfollowUser,
  getRecommendations,
  googleLogin,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getMe", authMiddleware, getMe);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/getFollowData/:id", authMiddleware, getFollowData);
router.get("/recommendations", authMiddleware, getRecommendations);
router.post("/google-login", googleLogin);  

export default router;