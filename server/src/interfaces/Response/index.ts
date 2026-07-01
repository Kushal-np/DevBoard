import { Types } from "mongoose";
import { ISocialMedia } from "../dbModels/user.interface.models"; 
export interface IRegisterResponse{
    name:string;
    email:string;
    username:string;
    passwordHash:string;
}

export interface IUserResponse{
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
    socialMedia? : ISocialMedia[]

}