"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const socketRegistry_1 = require("../sockets/socketRegistry");
const createNotification = async (input) => {
    if (input.recipientId === input.senderId)
        return; // don't notify yourself
    const notification = await notification_model_1.default.create(input);
    const populated = await notification.populate("senderId", "name username profile_url");
    (0, socketRegistry_1.emitToUser)(input.recipientId, "new-notification", populated);
    return populated;
};
exports.createNotification = createNotification;
//# sourceMappingURL=notification.services.js.map