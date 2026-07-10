import { Types } from "mongoose";

export interface IStar {
    userId: Types.ObjectId ; 
    projectId: Types.ObjectId ; 
    createdAt:Date ; 
    updatedAt:Date ; 
}