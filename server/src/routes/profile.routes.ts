import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import {
  getUserProfile,
  editProfile,
  changePassword,
  deleteAccount,
} from "../controllers/profile.controller";

const router = express.Router();

router.patch(
  "/edit",
  authMiddleware,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  editProfile
);
router.patch("/change-password", authMiddleware, changePassword);
router.delete("/", authMiddleware, deleteAccount);
router.get("/:username", authMiddleware, getUserProfile);

export default router;
