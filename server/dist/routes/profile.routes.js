"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const profile_controller_1 = require("../controllers/profile.controller");
const router = express_1.default.Router();
router.patch("/edit", auth_middleware_1.authMiddleware, upload_middleware_1.default.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
]), profile_controller_1.editProfile);
router.patch("/change-password", auth_middleware_1.authMiddleware, profile_controller_1.changePassword);
router.delete("/", auth_middleware_1.authMiddleware, profile_controller_1.deleteAccount);
router.get("/:username", auth_middleware_1.authMiddleware, profile_controller_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map