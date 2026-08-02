"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const bookmark_controller_1 = require("../controllers/bookmark.controller");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authMiddleware, bookmark_controller_1.getBookmarkPosts);
router.post("/:id", auth_middleware_1.authMiddleware, bookmark_controller_1.bookmarkPost);
router.delete("/:id", auth_middleware_1.authMiddleware, bookmark_controller_1.deleteFromBookmarks);
exports.default = router;
//# sourceMappingURL=bookmark.routes.js.map