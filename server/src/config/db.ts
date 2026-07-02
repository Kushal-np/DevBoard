import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to the mongodb");
    }   
    catch(error){   
        if(error instanceof Error){
            console.log(error);
        }
        else{
            console.log("Unknown error occured");
        }
    }
}
export default connectDB;