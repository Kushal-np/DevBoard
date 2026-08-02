"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const bookmark_routes_1 = __importDefault(require("./routes/bookmark.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const chat_socket_1 = require("./sockets/chat.socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const server = http_1.default.createServer(app);
(0, chat_socket_1.initChatSocket)(server);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/user", user_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use("/api/project", project_routes_1.default);
app.use("/api/bookmark", bookmark_routes_1.default);
app.use("/api/chat", message_routes_1.default);
app.use("/api/notification", notification_routes_1.default);
app.use("/api/comment", comment_routes_1.default);
app.use("/api/posts", post_routes_1.default);
app.use("/api/search", search_routes_1.default);
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    (0, db_1.default)();
});
//# sourceMappingURL=index.js.map