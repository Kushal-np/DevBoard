"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.post("/logout", user_controller_1.logout);
router.get("/getMe", auth_middleware_1.authMiddleware, user_controller_1.getMe);
router.post("/follow/:id", auth_middleware_1.authMiddleware, user_controller_1.followUser);
router.post("/unfollow/:id", auth_middleware_1.authMiddleware, user_controller_1.unfollowUser);
router.get("/getFollowData/:id", auth_middleware_1.authMiddleware, user_controller_1.getFollowData);
router.get("/recommendations", auth_middleware_1.authMiddleware, user_controller_1.getRecommendations);
exports.default = router;
//# sourceMappingURL=user.routes.js.map