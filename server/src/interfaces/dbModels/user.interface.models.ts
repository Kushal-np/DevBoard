import {Types} from "mongoose";
interface ISocialMedia{
    github? : string ; 
    twitter? : string ; 
    linkedin? : string; 
    portfolio?: string;
}

export interface IUser{
    username:string ; 
    email: string ; 
    name : string ; 
    passwordHash : string ; 
    followerCount : number; 
    followingCount : number ; 
    followers: Types.ObjectId[] ; 
    following:Types.ObjectId[];
    bio: string ; 
    profile_url : string ; 
    cover_url : string; 
    socialMedia? : ISocialMedia
}