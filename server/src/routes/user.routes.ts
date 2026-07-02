import express from "express";
import {Router} from "express";
import { register } from "../controllers/user.controller";


const router = Router();

router.post("/register" , register);
router.post("/login");
router.post("/logout");
router.post("/getme");

export default router;