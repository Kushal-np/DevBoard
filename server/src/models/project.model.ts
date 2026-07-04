import mongoose , {Schema} from "mongoose";
import { IProject, ITag } from "../interfaces/dbModels/project.interface.models";
const tagSchema = new Schema<ITag>({
    name:{
        type:String , 
        required:true 
    },
    category:{
        type:String , 
        requried:true 
    }
},{
    _id:false
})
const projectSchema = new mongoose.Schema<IProject>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User" , 
        required:true , 
    },
    title:{
        type:String ,
        required:true , 
    },
    description:{
        type:String , 
        required:true 
    },
    liveUrl:{
        type:String , 
    },
    repoUrl:{
        type:String , 
    }, 
    techStack:{
        type:[String] , 
        default:[],
    },
    tags:{
        type:[tagSchema],
        default:[]
    }, 
    thumbnailUrl:{
        type:String 
    },   
    stars:[
        {
            type: Schema.Types.ObjectId , 
            ref:"star"
        }
    ],
    starCount:{
        type:Number , 
        default:0,
    },
    viewCount:{
        type:Number , 
        default:0
    },
    status:{
        type:String , 
        enum:["draft" , "published" , "archived"],
        default:"published" , 
    },
    featured:{
        type:Boolean , 
        default: false 
    }
},
{
    timestamps:true
});

const Project = mongoose.model<IProject>("Project" , projectSchema);
export default Project ; 