import express from "express" ; 
import dotenv from "dotenv" ; 
import cors from "cors";
dotenv.config();
const app = express() ;

const PORT = process.env.PORT 

app.get("/" , (req , res) =>{
    res.send("hello world");
})

app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`)
})