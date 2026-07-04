import {Types} from "mongoose";

export type ProjectStatus = 
    | "draft"
    | "published"
    | "archived"

export interface ITag{
    name:string ; 
    category:string;
}
export interface IProject{
    userId : Types.ObjectId ; 
    title:string ;
    description:string ; 
    liveUrl?: string ; 
    repoUrl?: string; 
    techStack : string[] ; 
    tags: ITag[] ; 
    thumbnailUrl?: string;
    stars:  Types.ObjectId[] ; 
    starCount : number ; 
    viewCount : number;
    status :ProjectStatus;
    featured:boolean;
    createdAt:Date; 
    updatedAt:Date;
}