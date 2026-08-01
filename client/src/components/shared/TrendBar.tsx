// src/components/layout/TrendBar.tsx

import { useEffect, useState } from "react";
import { Users, ArrowUpRight, Flame, Clock, Award, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFollow } from "../../hooks/useFollow";
import apiClient from "../../api/axiosConfig";
import { RECOMMENDATION_ENDPOINT, POST_ENDPOINTS } from "../../api/endpoints";

interface RecommendedUser {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
  bio?: string;
}

interface PopularPost {
  _id: string;
  title: string;
  starCount: number;
  createdAt: string;
  userId?: { username: string };
}

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const TrendBar = () => {
  const { user } = useAuth();
  const { follow } = useFollow();

  const [recommended, setRecommended] = useState<RecommendedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    apiClient
      .get(RECOMMENDATION_ENDPOINT)
      .then((res) => setRecommended(res.data?.users ?? []))
      .catch(console.error)
      .finally(() => setIsLoadingUsers(false));

    apiClient
      .get(POST_ENDPOINTS.GET_EXPLORE)
      .then((res) => {
        const sorted = (res.data?.projects ?? [])
          .slice()
          .sort((a: PopularPost, b: PopularPost) => b.starCount - a.starCount)
          .slice(0, 4);
        setPopularPosts(sorted);
      })
      .catch(console.error)
      .finally(() => setIsLoadingPosts(false));
  }, []);

  const handleFollow = async (targetId: string) => {
    setFollowingIds((prev) => new Set(prev).add(targetId));
    try {
      await follow(targetId);
      setRecommended((prev) => prev.filter((u) => u._id !== targetId));
    } catch (err) {
      console.error(err);
      setFollowingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  return (
    <aside className="hidden lg:block lg:w-[340px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-6 lg:px-3 space-y-4">
      {/* Welcome Card */}
      <div className="rounded-2xl bg-surface/40 backdrop-blur-sm border border-border/30 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text">
              Welcome back, {user?.username || "Developer"}!
            </p>
            <p className="text-xs text-text-secondary/60">Discover what's trending</p>
          </div>
        </div>
      </div>

      {/* Who to Follow */}
      <div className="rounded-2xl border border-border/30 bg-surface/40 backdrop-blur-sm p-4 transition-colors hover:border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Users size={16} className="text-primary" />
            Who to Follow
          </h3>
        </div>

        {isLoadingUsers ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-9 rounded-lg bg-surface-hover animate-pulse" />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <p className="text-xs text-text-secondary/50">No suggestions right now.</p>
        ) : (
          <div className="space-y-3">
            {recommended.slice(0, 4).map((u) => (
              <div key={u._id} className="flex items-center gap-3 group">
                <Link to={`/profile/${u.username}`} className="shrink-0">
                  {u.profile_url ? (
                    <img
                      src={u.profile_url}
                      alt={u.name}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-border/20"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-medium text-primary ring-2 ring-border/20">
                      {getInitials(u.name)}
                    </div>
                  )}
                </Link>
                <Link to={`/profile/${u.username}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{u.name}</p>
                  <p className="text-xs text-text-secondary/60 truncate">@{u.username}</p>
                </Link>
                <button
                  onClick={() => handleFollow(u._id)}
                  disabled={followingIds.has(u._id)}
                  className="rounded-full border border-primary/20 px-3 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-background hover:border-primary disabled:opacity-50"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Now */}
      <div className="rounded-2xl border border-border/30 bg-surface/40 backdrop-blur-sm p-4 transition-colors hover:border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            Popular Now
          </h3>
          <Link
            to="/feed"
            className="text-xs text-primary hover:text-primary-hover transition flex items-center gap-1"
          >
            See All
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {isLoadingPosts ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-surface-hover animate-pulse" />
            ))}
          </div>
        ) : popularPosts.length === 0 ? (
          <p className="text-xs text-text-secondary/50">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {popularPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className="group block cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-surface-hover"
              >
                <p className="text-sm text-text font-medium transition-colors group-hover:text-primary line-clamp-2">
                  {post.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary/40">
                  <span>@{post.userId?.username ?? "unknown"}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {timeAgo(post.createdAt)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} />
                    {post.starCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Get Certified */}
      <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-4 transition-colors hover:border-primary/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 shrink-0">
            <Award size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text">Earn a Job-Ready Certificate</h4>
            <p className="text-xs text-text-secondary/60 mt-0.5">Explore diverse skills, and education.</p>
            <button className="mt-2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-background transition-colors hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-border/10">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-text-secondary/30">
          <a href="#" className="transition-colors hover:text-text-secondary/60">Terms</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Privacy</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Cookies</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Accessibility</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Ads Info</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">More</a>
        </div>
        <p className="text-[10px] text-text-secondary/20 mt-2">© 2026 BuildHub. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default TrendBar;