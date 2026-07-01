import mongoose , {Schema , Types} from "mongoose" ; 
import { INotification } from "../interfaces/dbModels/notification.interface.model";

export type NotificationType = 
    |"follow"
    |"star"
    |"comment"

const notificationSchema = new mongoose.Schema<INotification>({
    recipientId:{
        type: Schema.Types.ObjectId , 
        ref:"User", 
        required:true , 
    }, 
    actorId:{
        type:Schema.Types.ObjectId , 
        ref:"User" , 
        required:true , 
    }, 
    type:{
        type:String , 
        enum : ["follow" , "star" , "comment"] , 
        required:true 
    },
    refId:{
        type: Schema.Types.ObjectId 
    },
    read:{
        type:Boolean , 
        default:false 
    }, 

}
,{
    timestamps:true
})

const Notification = mongoose.model<INotification>("Notification" , notificationSchema);
export default Notification ; 