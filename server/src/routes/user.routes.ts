import express from "express";
import {Router} from "express";
import { getMe, login, logout, register } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();

router.post("/register" , register);
router.post("/login" , login);
router.post("/logout" , logout);
router.get("/getMe" ,authMiddleware, getMe);

export default router;