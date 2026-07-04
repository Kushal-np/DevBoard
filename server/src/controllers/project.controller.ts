import { Response , Request} from "express";
import Project from "../models/project.model";
import cloudinary from "../utils/cloudinary";
import { Types } from "mongoose";

export const createPost = async (
    req: Request,
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

export const getPosts = async(req:Request , res:Response):Promise<void> =>{
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
interface UserParams {
  id: string;
}
export const getPostsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User isn't authenticated",
      });
      return;
    }

    const { id } = req.params;

    const post = await Project.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      post,
      message: "Post found successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getFeed = async(req :Request , res:Response) :Promise<void> =>{
    try{
        if(!req.user){
            res.status(401).json({
                success:false , 
                message:"Unathourized",
            });
            return ; 
        }
        const page = Number(req.query.page) || 1 ; 
        const limit = Number(req.query.limit) || 10 ; 
        const skip = (page-1)*limit ; 
        const feedUserIds = [...req.user?.following , req.user?._id];
        const projects = await Project.find({
            userId:{$in:feedUserIds},
            status:"published",
        }).populate("userId","name username profile_url")
          .sort({createdAt:-1})
          .skip(skip)
          .limit(limit);

        res.status(200).json({
            success:true , 
            projects , 
            message:"Feed fetched successfully"
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false , 
            message:"Internal server error"
        });
    }
};

export const starPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const { id } = req.params;

    const currentPost = await Project.findById(id);

    if (!currentPost) {
      res.status(404).json({
        success: false,
        message: "Couldn't find the project",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(req.user._id);

    const alreadyStarred = currentPost.stars.some((i) =>
      i.equals(userObjectId)
    );

    if (alreadyStarred) {
      currentPost.stars = currentPost.stars.filter(
        (i) => !i.equals(userObjectId)
      );
      currentPost.starCount--;
    } else {
      currentPost.stars.push(userObjectId);
      currentPost.starCount++;
    }

    await currentPost.save();

    res.status(200).json({
      success: true,
      starred: !alreadyStarred,
      starCount: currentPost.starCount,
      message: alreadyStarred
        ? "Post unstarred successfully."
        : "Post starred successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};