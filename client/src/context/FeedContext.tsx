import { createContext, useState, type ReactNode, useCallback } from "react";

import type { IPost } from "../types/Post";
import {
  createPost,
  GetPost,
  getIndividualPost,
  LikePost,
  getFeaturedPosts,
  getExplorePosts,
  updatePost,
  deletePost,
} from "../api/services/feed.service";

interface FeedContextType {
  posts: IPost[];
  featuredPosts: IPost[];
  explorePosts: IPost[];
  currentPost: IPost | null;
  isLoading: boolean;
  isFeaturedLoading: boolean;

  CreatePost: (data: FormData) => Promise<void>;
  getPosts: () => Promise<void>;
  getPostById: (id: string) => Promise<void>;
  Likepost: (id: string) => Promise<void>;
  getFeatured: () => Promise<void>;
  getExplore: () => Promise<void>;
  UpdatePost: (id: string, data: FormData) => Promise<void>;
  DeletePost: (id: string) => Promise<void>;
}

export const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<IPost[]>([]);
  const [explorePosts, setExplorePosts] = useState<IPost[]>([]);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(false);

  const getPosts = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await GetPost();

      if (Array.isArray(res.Projects)) {
        const validPosts = res.Projects.filter((post) => post.title && post.title.trim() !== "");
        setPosts(validPosts);
      } else if (res.Projects) {
        setPosts([res.Projects]);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error(error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFeatured = useCallback(async () => {
    try {
      setIsFeaturedLoading(true);
      const res = await getFeaturedPosts();
      setFeaturedPosts(res.projects ?? []);
    } catch (error) {
      console.error(error);
      setFeaturedPosts([]);
    } finally {
      setIsFeaturedLoading(false);
    }
  }, []);

  const getExplore = useCallback(async () => {
    try {
      const res = await getExplorePosts();
      setExplorePosts(res.projects ?? []);
    } catch (error) {
      console.error(error);
      setExplorePosts([]);
    }
  }, []);

  const CreatePost = async (formData: FormData) => {
    try {
      setIsLoading(true);

      const title = (formData.get("title") as string) || "Untitled";
      const description = (formData.get("description") as string) || "";

      const optimisticPost: IPost = {
        _id: `temp-${Date.now()}`,
        userId: { _id: "", username: "", name: "" },
        title,
        description,
        liveUrl: (formData.get("liveUrl") as string) || "",
        repoUrl: (formData.get("repoUrl") as string) || "",
        techStack: [],
        tags: [],
        thumbnailUrl: "",
        stars: [],
        starCount: 0,
        viewCount: 0,
        status: "draft",
        featured: false,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPosts((prev) => [optimisticPost, ...prev]);

      await createPost(formData);

      setTimeout(() => {
        getPosts();
      }, 500);
    } catch (error) {
      console.error(error);

      setPosts((prev) => prev.filter((post) => !post._id.startsWith("temp-")));

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPostById = async (id: string) => {
    try {
      setIsLoading(true);

      const res = await getIndividualPost(id);

      setCurrentPost(res.post);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Likepost = async (id: string) => {
    try {
      const res = await LikePost(id);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === id
            ? {
                ...post,
                starCount: res.starCount,
                isLiked: res.starred,
              }
            : post
        )
      );

      setCurrentPost((prev) => {
        if (!prev || prev._id !== id) return prev;

        return {
          ...prev,
          starCount: res.starCount,
          isLiked: res.starred,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const UpdatePost = async (id: string, formData: FormData) => {
    try {
      setIsLoading(true);
      const res = await updatePost(id, formData);
      setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, ...res.project } : p)));
      setCurrentPost((prev) => (prev && prev._id === id ? { ...prev, ...res.project } : prev));
    } finally {
      setIsLoading(false);
    }
  };

  const DeletePost = async (id: string) => {
    const prevPosts = posts;
    setPosts((prev) => prev.filter((p) => p._id !== id));
    try {
      await deletePost(id);
    } catch (error) {
      console.error(error);
      setPosts(prevPosts);
      throw error;
    }
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        featuredPosts,
        explorePosts,
        currentPost,
        isLoading,
        isFeaturedLoading,
        CreatePost,
        getPosts,
        getPostById,
        Likepost,
        getFeatured,
        getExplore,
        UpdatePost,
        DeletePost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}
