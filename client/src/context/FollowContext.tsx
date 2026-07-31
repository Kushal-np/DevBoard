import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from "react";

import {
  followUser,
  unfollowUser,
  getFollowData,
} from "../api/services/follow.service";
import type { FollowUser } from "../types/follow";

interface FollowContextType {
  following: FollowUser[];
  followers: FollowUser[];

  followerCount: number;
  followingCount: number;

  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;

  refreshFollowData: (userId: string) => Promise<void>;

  // Exposed so pages can do optimistic updates (flip UI instantly,
  // then reconcile with refreshFollowData in the background).
  setFollowers: Dispatch<SetStateAction<FollowUser[]>>;
  setFollowing: Dispatch<SetStateAction<FollowUser[]>>;

  isLoading: boolean;
}

export const FollowContext = createContext<FollowContextType | undefined>(
  undefined
);

export function FollowProvider({ children }: { children: ReactNode }) {
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const refreshFollowData = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await getFollowData(userId);
      setFollowing(res.following);
      setFollowers(res.followers);
    } catch (error) {
      console.error("Get follow data failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const follow = async (userId: string) => {
    try {
      setIsLoading(true);
      await followUser(userId);
    } catch (error) {
      console.error("Follow failed:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };


  const unfollow = async (userId: string) => {
    try {
      setIsLoading(true);
      await unfollowUser(userId);
    } catch (error) {
      console.error("Unfollow failed:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FollowContext.Provider
      value={{
        following,
        followers,
        followerCount: followers.length,
        followingCount: following.length,
        follow,
        unfollow,
        refreshFollowData,
        setFollowers,
        setFollowing,
        isLoading,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
}