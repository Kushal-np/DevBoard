import express from "express";
import {Router} from "express";


const router = Router();

router.post("/register");
router.post("/login");
router.post("/logout");
router.post("/getme");

export default router;