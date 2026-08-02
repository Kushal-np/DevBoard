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
  Pencil,
  Trash2,
  Bookmark as BookmarkIcon,
  Link2,
  Check,
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
  const { posts, getPosts, isLoading, Likepost, DeletePost } = useFeed();
  const { bookmarks, toggle: toggleBookmark, fetchBookmarks } = useBookmark();
  const { user } = useAuth();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visiblePosts, setVisiblePosts] = useState(5);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const [likeState, setLikeState] = useState<Record<string, LikeState>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bouncingBookmarkId, setBouncingBookmarkId] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPosts();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleShare = async (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(postId);
      setTimeout(() => setCopiedId((id) => (id === postId ? null : id)), 1800);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const handleDelete = async (postId: string) => {
    setOpenMenuId(null);
    if (!window.confirm("Delete this project? This can't be undone.")) return;
    try {
      await DeletePost(postId);
    } catch {
      // error already surfaced via console in context
    }
  };

  const isBookmarked = (postId: string) => bookmarks.some((b: any) => b?._id === postId);

  const handleBookmarkClick = (postId: string) => {
    setBouncingBookmarkId(postId);
    setTimeout(() => setBouncingBookmarkId((id) => (id === postId ? null : id)), 320);
    toggleBookmark(postId);
  };

  const safePosts = Array.isArray(posts) ? posts.filter((post: any) => post?.title) : [];

  const displayedPosts = safePosts.slice(0, visiblePosts);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-surface animate-pulse" />
        ))}
      </div>
    );
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
        const author = post.userId;
        const profileHref = author?.username ? `/profile/${author.username}` : null;
        const isMine = !!user?._id && author?._id === user._id;

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
                    {author?.profile_url ? (
                      <img
                        src={author.profile_url}
                        className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {getInitials(author?.name)}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {getInitials(author?.name)}
                  </div>
                )}

                <div>
                  {profileHref ? (
                    <Link to={profileHref} className="text-text font-semibold hover:text-primary transition">
                      {author?.name || "anonymous"}
                    </Link>
                  ) : (
                    <span className="text-text font-semibold">{author?.name || "anonymous"}</span>
                  )}

                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(post.createdAt)}
                    {post.status === "draft" && (
                      <span className="ml-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                        Draft
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="relative" ref={openMenuId === postId ? menuRef : undefined}>
                <button
                  onClick={() => setOpenMenuId((id) => (id === postId ? null : postId))}
                  className="rounded-full p-1.5 text-text-secondary transition hover:bg-background hover:text-text"
                  aria-label="Post options"
                >
                  <MoreHorizontal size={17} />
                </button>

                {openMenuId === postId && (
                  <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                    {isMine ? (
                      <>
                        <Link
                          to={`/post/${postId}`}
                          onClick={() => setOpenMenuId(null)}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-text transition hover:bg-background"
                        >
                          <Pencil size={14} />
                          View / Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(postId)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger transition hover:bg-danger/10"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleShare(postId);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-text transition hover:bg-background"
                      >
                        <Link2 size={14} />
                        Copy link
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT */}
            <div className="px-5 space-y-3">
              <Link to={`/post/${postId}`}>
                <h2 className="font-display text-xl font-semibold text-text hover:text-primary transition">
                  {post.title}
                </h2>
              </Link>

              <p className="text-text-secondary leading-relaxed">{post.description}</p>
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
                  state.liked ? "text-warning" : "text-text-secondary hover:text-warning"
                }`}
              >
                <Star size={16} fill={state.liked ? "currentColor" : "none"} />
                {state.count}
              </button>

              <button
                onClick={() => setActiveCommentPostId(postId)}
                className="flex items-center gap-1.5 text-text-secondary transition hover:text-primary"
              >
                <MessageCircle size={16} />
                {commentCounts[postId] ?? ""}
              </button>

              <button
                onClick={() => handleBookmarkClick(postId)}
                className={`flex items-center gap-1.5 transition-colors ${
                  isBookmarked(postId) ? "text-primary" : "text-text-secondary hover:text-primary"
                }`}
              >
                <BookmarkIcon
                  size={16}
                  fill={isBookmarked(postId) ? "currentColor" : "none"}
                  className={`transition-transform duration-300 ${
                    bouncingBookmarkId === postId ? "scale-125" : "scale-100"
                  }`}
                />
                {isBookmarked(postId) ? "Saved" : "Bookmark"}
              </button>

              <button
                onClick={() => handleShare(postId)}
                className="flex items-center gap-1 text-text-secondary transition hover:text-primary"
              >
                {copiedId === postId ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
                {copiedId === postId ? "Copied" : "Share"}
              </button>
            </div>
          </article>
        );
      })}

      {activeCommentPostId && (
        <CommentModal
          postId={activeCommentPostId}
          onClose={() => setActiveCommentPostId(null)}
          onCommentCountChange={(count) =>
            setCommentCounts((prev) => ({ ...prev, [activeCommentPostId]: count }))
          }
        />
      )}
    </div>
  );
};

export default PostContainer;
