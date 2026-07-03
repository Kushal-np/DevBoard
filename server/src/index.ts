import express from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes"
import cookieParser from "cookie-parser";
dotenv.config();
const app = express() ;

const PORT = process.env.PORT 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api/user" , userRoutes);
app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`);
    connectDB();
})