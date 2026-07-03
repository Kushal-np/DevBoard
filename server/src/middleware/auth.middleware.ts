import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ISocialMedia } from "../interfaces/dbModels/user.interface.models";
import { IJWTPayload } from "../interfaces/Response/Jwt";
import User from "../models/user.model";

export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    _id: string;
    username: string;
    email: string;
    name: string;
    passwordHash: string;
    followerCount: number;
    followingCount: number;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    bio: string;
    profile_url: string;
    cover_url: string;
    socialMedia?: ISocialMedia;
  };
}

export const authMiddleware = async(req: AuthRequest , res:Response , next:NextFunction) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false , 
                message:"Not authorized , no token",
            });
        }
        const decoded = jwt.verify(
            token , 
            process.env.JWT_SECRET_KEY!,
        )as IJWTPayload;

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({
                success:false , 
                message:"User not found",
            });
        }
        req.user={
        _id: user!._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
        profile_url: user.profile_url,
        cover_url: user.cover_url,
        };
        next();
    }
    catch(error){
        console.log("Auth middleware error" , error);
        return res.status(401).json({
            success:false , 
            message:"Not authorized , can't access"
        })
    }
}