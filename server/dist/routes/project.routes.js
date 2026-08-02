"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/create-post", auth_middleware_1.authMiddleware, upload_middleware_1.default.single("thumbnail"), project_controller_1.createPost);
router.get("/get-post", auth_middleware_1.authMiddleware, project_controller_1.getPosts);
router.get("/get-post/:id", auth_middleware_1.authMiddleware, project_controller_1.getPostsById);
router.get("/getFeed", auth_middleware_1.authMiddleware, project_controller_1.getFeed);
router.post("/:id/star", auth_middleware_1.authMiddleware, project_controller_1.starPost);
router.get("/star", auth_middleware_1.authMiddleware, project_controller_1.getStarredPost);
router.get("/featured", auth_middleware_1.authMiddleware, project_controller_1.getFeaturedPosts);
router.get("/explore", auth_middleware_1.authMiddleware, project_controller_1.getExplorePosts);
router.get("/user/:userId", auth_middleware_1.authMiddleware, project_controller_1.getProjectsByUser);
exports.default = router;
//# sourceMappingURL=project.routes.js.map