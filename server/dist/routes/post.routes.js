"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authMiddleware, upload_middleware_1.default.single("image"), post_controller_1.createPost);
router.get("/feed", auth_middleware_1.authMiddleware, post_controller_1.getPostsFeed);
router.get("/user/:userId", auth_middleware_1.authMiddleware, post_controller_1.getPostsByUser);
router.post("/:id/like", auth_middleware_1.authMiddleware, post_controller_1.likePost);
router.get("/liked", auth_middleware_1.authMiddleware, post_controller_1.getLikedPosts);
exports.default = router;
//# sourceMappingURL=post.routes.js.map