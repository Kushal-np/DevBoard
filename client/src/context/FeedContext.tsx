// src/context/FeedContext.tsx

import {
  createContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";

import type { IPost } from "../types/Post";
import {
  createPost,
  GetPost,
  getIndividualPost,
  LikePost,
} from "../api/services/feed.service";

interface FeedContextType {
  posts: IPost[];
  currentPost: IPost | null;
  isLoading: boolean;

  CreatePost: (data: FormData) => Promise<void>;
  getPosts: () => Promise<void>;
  getPostById: (id: string) => Promise<void>;
  Likepost: (id: string) => Promise<void>;
}

export const FeedContext = createContext<FeedContextType | undefined>(
  undefined
);

export function FeedProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [currentPost, setCurrentPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await GetPost();

      if (Array.isArray(res.Projects)) {
        const validPosts = res.Projects.filter(
          (post) => post.title && post.title.trim() !== ""
        );

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

  const CreatePost = async (formData: FormData) => {
    try {
      setIsLoading(true);

      const title = (formData.get("title") as string) || "Untitled";
      const description =
        (formData.get("description") as string) || "";

      const optimisticPost: IPost = {
        _id: `temp-${Date.now()}`,
        userId: "",
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setPosts((prev) => [optimisticPost, ...prev]);

      await createPost(formData);

      setTimeout(() => {
        getPosts();
      }, 500);
    } catch (error) {
      console.error(error);

      setPosts((prev) =>
        prev.filter((post) => !post._id.startsWith("temp-"))
      );

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

    // Update the feed
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

    // Update the currently opened post
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

  return (
    <FeedContext.Provider
      value={{
        posts,
        currentPost,
        isLoading,
        CreatePost,
        getPosts,
        getPostById,
        Likepost,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}