import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/dbModels/user.interface.models"

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    followerCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
        type: Schema.Types.ObjectId,
        ref: "User"
        }
    ],
    bio: {
        type: String,
        default: "Hey I am new to DevBoard !"
    },
    profile_url: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
    },
    cover_url: {
        type: String,
        default: " ",
    },
    socialMedia: {
        github: {
            type: String,
            default: undefined,
        },
        twitter: {
            type: String,
            default: undefined,
        },
        linkedin: {
            type: String,
            default: undefined,
        },
        portfolio: {
            type: String,
            default: undefined,
        }
    }


}, {
    timestamps: true
})

const User = mongoose.model<IUser>("User", userSchema);
export default User;