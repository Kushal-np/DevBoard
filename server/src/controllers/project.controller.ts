import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Project from "../models/project.model";
import cloudinary from "../utils/cloudinary";

export const createPost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        console.log(userId);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        let {
            title,
            description,
            liveUrl,
            repoUrl,
            techStack,
            tags,
            status,
        } = req.body;

        techStack =
            typeof techStack === "string"
                ? JSON.parse(techStack)
                : techStack;

        tags =
            typeof tags === "string"
                ? JSON.parse(tags)
                : tags;

        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: "Title and description are required.",
            });
            return;
        }

        if (!Array.isArray(techStack)) {
            res.status(400).json({
                success: false,
                message: "techStack must be an array.",
            });
            return;
        }

        if (!Array.isArray(tags)) {
            res.status(400).json({
                success: false,
                message: "tags must be an array.",
            });
            return;
        }

        let thumbnailUrl :  string | undefined = "";

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "projects/thumbnails",
            });

            thumbnailUrl = uploadResult.secure_url;
        }

        const project = await Project.create({
            userId,
            title,
            description,
            liveUrl,
            repoUrl,
            techStack,
            tags,
            thumbnailUrl,
            starCount: 0,
            viewCount: 0,
            featured: false,
            status: status || "draft",
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: project,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const getPosts = async(req:AuthRequest , res:Response):Promise<void> =>{
    try{
        const userId = req.user?._id

        if(!userId){
            res.status(401).json({
                success:false , 
                message:"user isn't authenticated"
            })
        }

        const Projects = await Project.find();

        res.status(201).json({
            success : true , 
            Projects , 
            message:"Projects fetched successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success:false , 
            message:"Internal server error"
        })
    }
}

export const getPostsById = async(req:AuthRequest , res:Response):Promise<void> =>{
    try{
        const userId = req.user?._id;
        if(!userId){
            res.status(401).json({
                success:false , 
                message:"User isn't authenticated"
            })
        }else{
            const postId = req.params;
            const post = await Project.findOne({postId});
            res.status(201).json({
                success:true , 
                post , 
                message:"Post found successfully!"
            })
        }
        
    }
    catch(error){
        res.status(500).json({
            success:false , 
            message:"Internal server error"
        })
    }
}