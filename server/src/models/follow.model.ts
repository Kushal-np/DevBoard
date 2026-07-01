import mongoose , {Schema , Types} from "mongoose" ; 
import { IFollow } from "../interfaces/dbModels/follow.interface.model";
const followSchema = new mongoose.Schema<IFollow>({
    followerId:{
        type:Schema.Types.ObjectId, 
        ref:"User" , 
        required:true 
    },
    followingId:{
        type:Schema.Types.ObjectId,
        ref:"User" , 
        required:true
    }
},
{
    timestamps:true
});

followSchema.index(
    {followerId: 1 , followingId : 1},
    {unique:true}
)

const Follow = mongoose.model<IFollow>("Follow" , followSchema);
export default Follow ; 