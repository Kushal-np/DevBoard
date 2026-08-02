import express from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import chatRoutes from "./routes/message.routes";
import notificationRoutes from "./routes/notification.routes";
import commentRoutes from "./routes/comment.routes";
import postRoutes from "./routes/post.routes";
import searchRoutes from "./routes/search.routes";
import cookieParser from "cookie-parser";
import http from "http";
import { initChatSocket } from "./sockets/chat.socket";
dotenv.config();
const app = express() ;
const PORT = process.env.PORT 
const server = http.createServer(app);
initChatSocket(server);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api/user" , userRoutes);
app.use("/api/profile" , profileRoutes );
app.use("/api/project" , projectRoutes )
app.use("/api/bookmark" , bookmarkRoutes);
app.use("/api/chat" , chatRoutes);
app.use("/api/notification" , notificationRoutes);
app.use("/api/comment" , commentRoutes);
app.use("/api/posts", postRoutes); 
app.use("/api/search" , searchRoutes);
server.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`);
    connectDB();
})

