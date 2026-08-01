import { createContext, useCallback, useState, type ReactNode } from "react";
import type { ITextPost } from "../types/TextPost";
import { getPostsFeed, createTextPost, likeTextPost } from "../api/services/textPost.service";

interface TextPostContextType {
  posts: ITextPost[];
  isLoading: boolean;
  getPosts: () => Promise<void>;
  addPost: (formData: FormData) => Promise<ITextPost>;
  toggleLike: (id: string) => Promise<void>;
}

export const TextPostContext = createContext<TextPostContextType | undefined>(undefined);

export const TextPostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<ITextPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPostsFeed();
      setPosts(res.posts ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPost = useCallback(async (formData: FormData) => {
    const res = await createTextPost(formData);
    setPosts((prev) => [res.post, ...prev]);
    return res.post;
  }, []);

  const toggleLike = useCallback(async (id: string) => {
    try {
      const res = await likeTextPost(id);
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, likeCount: res.likeCount } : p))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <TextPostContext.Provider value={{ posts, isLoading, getPosts, addPost, toggleLike }}>
      {children}
    </TextPostContext.Provider>
  );
};