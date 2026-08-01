export interface ITextPostUser {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
}

export interface ITextPost {
  _id: string;
  userId: ITextPostUser;
  text: string;
  imageUrl?: string;
  likes: string[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}