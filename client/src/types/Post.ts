export interface IPostUser {
  _id: string;
  username: string;
  name: string;
  bio?: string;
  profile_url?: string;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  techStack: string[];
  tags: string[];
  thumbnailUrl?: string;
  starCount: number;
  viewCount: number;
  featured: boolean;
  status: "draft" | "published";
  createdAt: string;
  userId: IPostUser;   // populated object, not a string
}