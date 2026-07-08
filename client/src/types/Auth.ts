export interface ISocialMedia {
  github?: string;
  twitter?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  name: string;
  passwordHash:string;  
  followerCount: number;
  followingCount: number;
  followers: string[];
  following: string[];

  bio: string;

  profile_url: string;
  cover_url: string;

  socialMedia?: ISocialMedia;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: IUser;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: IUser;
}

export interface MeResponse {
  success: boolean;
  user: IUser;
}