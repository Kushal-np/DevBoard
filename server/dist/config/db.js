"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to the mongodb");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
        else {
            console.log("Unknown error occured");
        }
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map