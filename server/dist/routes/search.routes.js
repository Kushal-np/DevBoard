"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const search_controller_1 = require("../controllers/search.controller");
const router = express_1.default.Router();
router.get("/users", auth_middleware_1.authMiddleware, search_controller_1.searchUsers);
router.get("/posts", auth_middleware_1.authMiddleware, search_controller_1.searchPosts);
router.get("/tags", auth_middleware_1.authMiddleware, search_controller_1.searchByTag);
exports.default = router;
//# sourceMappingURL=search.routes.js.map