// src/components/features/PostContainer.tsx

import { useEffect, useState, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import {
  Eye,
  Star,
  MessageCircle,
  Share2,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBookmark } from "../../hooks/useBookmark";
import { useAuth } from "../../hooks/useAuth";
import CommentModal from "../Comment/Comment";

export interface IPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    profile_url?: string;
  };
  title: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  techStack: string[];
  tags: {
    name: string;
    category: string;
  }[];
  thumbnailUrl?: string;
  stars: string[];
  starCount: number;
  viewCount: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface LikeState {
  liked: boolean;
  count: number;
}

const PostContainer = () => {
  const { posts, getPosts, isLoading, Likepost } = useFeed();
  const { toggle } = useBookmark();
  const { user } = useAuth();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  // Which post's comment modal is open (null = none). Tracking the id
  // instead of a single boolean means each post opens its own modal
  // with the right data, instead of one shared flag with no context.
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const [likeState, setLikeState] = useState<Record<string, LikeState>>({});

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visiblePosts < (posts?.length || 0)) {
        setVisiblePosts((prev) => Math.min(prev + 3, posts.length));
      }
    });

    if (lastPostRef.current) observerRef.current.observe(lastPostRef.current);

    return () => observerRef.current?.disconnect();
  }, [posts, visiblePosts]);

  useEffect(() => {
    if (!Array.isArray(posts)) return;

    setLikeState((prev) => {
      const next = { ...prev };

      posts.forEach((post: any) => {
        const id = post?._id;
        if (!id || next[id]) return;

        const liked =
          !!user?._id &&
          Array.isArray(post.stars) &&
          post.stars.some((s: string) => String(s) === String(user._id));

        next[id] = {
          liked,
          count: post.starCount ?? post.stars?.length ?? 0,
        };
      });

      return next;
    });
  }, [posts, user?._id]);

  const getPostId = (post: any) => {
    return post?._id || crypto.randomUUID();
  };

  const getThumbnailUrl = (post: any) => {
    return post?.thumbnailUrl || post?.thumbnail || null;
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const getInitials = (name: string) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

    return d.toLocaleDateString();
  };

  const handleLikeClick = async (postId: string) => {
    if (!postId) return;

    const current = likeState[postId] ?? { liked: false, count: 0 };
    const optimistic: LikeState = {
      liked: !current.liked,
      count: current.liked ? current.count - 1 : current.count + 1,
    };

    setLikeState((prev) => ({ ...prev, [postId]: optimistic }));

    try {
      await Likepost(postId);
    } catch {
      setLikeState((prev) => ({ ...prev, [postId]: current }));
    }
  };

  const safePosts = Array.isArray(posts)
    ? posts.filter((post: any) => post?.title)
    : [];

  const displayedPosts = safePosts.slice(0, visiblePosts);

  if (isLoading) {
    return <div className="p-5 text-text-secondary">Loading posts...</div>;
  }

  if (safePosts.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-text-secondary">
        No posts found
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {displayedPosts.map((post: any, index: number) => {
        const postId = getPostId(post);
        const thumbnail = getThumbnailUrl(post);
        const user = post.userId;
        const profileHref = user?.username ? `/profile/${user.username}` : null;

        const state = likeState[postId] ?? {
          liked: false,
          count: post.starCount ?? 0,
        };

        return (
          <article
            key={postId}
            ref={index === displayedPosts.length - 1 ? lastPostRef : null}
            className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link to={profileHref}>
                    {user?.profile_url ? (
                      <img
                        src={user.profile_url}
                        className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}

                <div>
                  {profileHref ? (
                    <Link
                      to={profileHref}
                      className="text-text font-semibold hover:text-primary transition"
                    >
                      {user?.name || "anonymous"}
                    </Link>
                  ) : (
                    <span className="text-text font-semibold">
                      {user?.name || "anonymous"}
                    </span>
                  )}

                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              <MoreHorizontal size={17} className="text-text-secondary" />
            </div>

            {/* CONTENT */}
            <div className="px-5 space-y-3">
              <Link to={`/post/${postId}`}>
                <h2 className="font-display text-xl font-semibold text-text hover:text-primary transition">
                  {post.title}
                </h2>
              </Link>

              <p className="text-text-secondary leading-relaxed">
                {post.description}
              </p>
            </div>

            {thumbnail && !imageErrors[postId] && (
              <div className="mt-5 w-full">
                <img
                  src={thumbnail}
                  alt={post.title}
                  onError={() => handleImageError(postId)}
                  className="w-full max-h-[450px] object-cover"
                />
              </div>
            )}

            {/* TECH STACK */}
            <div className="px-5 pt-5 flex flex-wrap gap-2">
              {post.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* TAGS */}
            {post.tags?.length > 0 && (
              <div className="px-5 py-4 flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span key={tag.name} className="text-xs text-text-secondary">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* STATS */}
            <div className="px-5 py-3 border-t border-border flex justify-end text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {post.viewCount} views
              </span>
            </div>

            {/* ACTIONS */}
            <div className="border-t border-border px-5 py-3 flex justify-around">
              <button
                onClick={() => handleLikeClick(postId)}
                className={`flex items-center gap-1.5 transition ${
                  state.liked
                    ? "text-warning"
                    : "text-text-secondary hover:text-warning"
                }`}
              >
                <Star size={16} fill={state.liked ? "currentColor" : "none"} />
                {state.count}
              </button>

              <button
                onClick={() => setActiveCommentPostId(postId)}
                className="flex items-center gap-1 text-text-secondary hover:text-primary transition"
              >
                <MessageCircle size={16} />
                Comment
              </button>

              <button
                onClick={() => toggle(post._id)}
                className="text-text-secondary hover:text-primary transition"
              >
                Bookmark
              </button>

              <button className="flex items-center gap-1 text-text-secondary hover:text-primary transition">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </article>
        );
      })}

      {activeCommentPostId && (
        <CommentModal
          postId={activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
        />
      )}
    </div>
  );
};

export default PostContainer;