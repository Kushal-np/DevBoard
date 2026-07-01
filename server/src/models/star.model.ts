import mongoose , {Schema , Types} from "mongoose";
import { IStar } from "../interfaces/dbModels/star.interface.model";


const starSchema = new mongoose.Schema<IStar>({
    userId:{
        type:Schema.Types.ObjectId , 
        ref:"User" , 
        required:true
    },
    projectId:{
        type:Schema.Types.ObjectId , 
        ref:"Project" , 
        required:true
    }
},
{
    timestamps:true
});

starSchema.index({
    userId:1 , projectId:1
} , 
{
    unique:true 
})

const Star = mongoose.model<IStar>("Star" , starSchema);
export default Star ; 

