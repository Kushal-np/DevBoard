import express from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes"
import bookmarkRoutes from "./routes/bookmark.routes"
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

app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`);
    connectDB();
})

//v1 of backend