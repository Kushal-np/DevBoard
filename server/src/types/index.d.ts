import "express-serve-static-core";
import { Types } from "mongoose";
import { ISocialMedia } from "../../interfaces/dbModels/user.interface.models";

declare module "express-serve-static-core" {
  interface User {
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
  }
  interface Request {
    user?: User;
  }
}
export {};