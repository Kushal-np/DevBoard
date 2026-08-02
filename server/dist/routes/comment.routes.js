"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
router.post("/:projectId", auth_middleware_1.authMiddleware, comment_controller_1.createComment);
router.get("/:projectId", comment_controller_1.getComments);
router.delete("/:id", auth_middleware_1.authMiddleware, comment_controller_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map