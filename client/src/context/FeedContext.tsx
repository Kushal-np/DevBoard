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
  type PostData,
} from "../api/services/feed.service";

interface FeedContextType {
  posts: IPost[];
  currentPost: IPost | null;
  isLoading: boolean;

  CreatePost: (data: FormData) => Promise<void>;
  getPosts: () => Promise<void>;
  getPostById: (id: string) => Promise<void>;
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

      // Handle both array and single object responses
      if (Array.isArray(res.Projects)) {
        // Filter out any posts without a title or with empty titles
        const validPosts = res.Projects.filter(post => post.title && post.title.trim() !== '');
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

      // Create an optimistic post with a temporary ID
      const title = formData.get('title') as string || 'Untitled';
      const description = formData.get('description') as string || '';
      
      const optimisticPost: IPost = {
        _id: `temp-${Date.now()}`,
        userId: '',
        title: title,
        description: description,
        liveUrl: formData.get('liveUrl') as string || '',
        repoUrl: formData.get('repoUrl') as string || '',
        techStack: [],
        tags: [],
        thumbnailUrl: '/api/placeholder/400/200', // Placeholder while loading
        stars: [],
        starCount: 0,
        viewCount: 0,
        status: 'draft',
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add optimistic post immediately
      if (title && title.trim() !== '') {
        setPosts((prev) => [optimisticPost, ...prev]);
      }

      // Send the actual request
      const res = await createPost(formData);

      // Re-fetch posts to get the complete data including thumbnail
      // Wait a bit for the backend to process the image
      setTimeout(() => {
        getPosts();
      }, 500);

    } catch (error) {
      console.error(error);
      // Remove the optimistic post on error
      setPosts((prev) => prev.filter(post => !post._id.toString().startsWith('temp-')));
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

  return (
    <FeedContext.Provider
      value={{
        posts,
        currentPost,
        isLoading,
        CreatePost,
        getPosts,
        getPostById,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}