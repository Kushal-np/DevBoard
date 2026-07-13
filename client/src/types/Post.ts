export interface IPost {
    _id:string;
    userId: string;
    title: string;
    description: string;
    liveUrl?: string;
    repoUrl?: string;
    techStack: string[];
    tags: string[];
    thumbnailUrl?: string;
    stars: string[];
    starCount: number;
    viewCount: number;
    status: | "draft" | "published" | "archived";
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}