export interface IPostUser {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profile_url?: string;
}

export interface ITag {
  name: string;
  category: string;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  techStack: string[];
  tags: ITag[];
  thumbnailUrl?: string;
  stars: string[];
  starCount: number;
  viewCount: number;
  featured: boolean;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  userId: IPostUser; 
  isLiked?: boolean;
}
