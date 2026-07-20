export interface IComment {
  _id: string;
  projectId: string;
  text: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    profile_url?: string;
  };
}
