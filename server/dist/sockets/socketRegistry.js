"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToUser = exports.setIO = void 0;
let ioInstance = null;
const setIO = (io) => {
    ioInstance = io;
};
exports.setIO = setIO;
const emitToUser = (userId, event, payload) => {
    if (!ioInstance)
        return;
    ioInstance.to(`user:${userId}`).emit(event, payload);
};
exports.emitToUser = emitToUser;
//# sourceMappingURL=socketRegistry.js.map