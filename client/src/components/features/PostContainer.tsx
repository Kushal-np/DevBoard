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
import Badge from "../ui/Badge";

const PostContainer = () => {
  const { posts, getPosts, isLoading, Likepost, DeletePost } = useFeed();
  const { bookmarks, toggle: toggleBookmark, fetchBookmarks } = useBookmark();
  const { user } = useAuth();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [likeState, setLikeState] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPosts();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
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
          !!user?._id && Array.isArray(post.stars) && post.stars.some((s: string) => String(s) === String(user._id));
        next[id] = { liked, count: post.starCount ?? post.stars?.length ?? 0 };
      });
      return next;
    });
  }, [posts, user?._id]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
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
    const current = likeState[postId] ?? { liked: false, count: 0 };
    const optimistic = { liked: !current.liked, count: current.liked ? current.count - 1 : current.count + 1 };
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
      /* surfaced via context */
    }
  };

  const isBookmarked = (postId: string) => bookmarks.some((b: any) => b?._id === postId);
  const safePosts = Array.isArray(posts) ? posts.filter((post: any) => post?.title) : [];
  const displayedPosts = safePosts.slice(0, visiblePosts);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    );
  }

  if (safePosts.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-display text-lg text-text">No projects yet</p>
        <p className="text-sm text-text-secondary">Be the first to publish something here.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {displayedPosts.map((post: any, index: number) => {
        const postId = post._id;
        const thumbnail = post?.thumbnailUrl || post?.thumbnail || null;
        const author = post.userId;
        const profileHref = author?.username ? `/profile/${author.username}` : null;
        const isMine = !!user?._id && author?._id === user._id;
        const state = likeState[postId] ?? { liked: false, count: post.starCount ?? 0 };

        return (
          <article
            key={postId}
            ref={index === displayedPosts.length - 1 ? lastPostRef : null}
            className="overflow-hidden rounded-md border border-border bg-surface transition-colors duration-micro hover:border-border-strong"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link to={profileHref}>
                    {author?.profile_url ? (
                      <img src={author.profile_url} className="h-10 w-10 rounded-full object-cover ring-1 ring-border" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-wash font-mono text-sm font-medium text-primary">
                        {getInitials(author?.name)}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-wash font-mono text-sm font-medium text-primary">
                    {getInitials(author?.name)}
                  </div>
                )}

                <div>
                  {profileHref ? (
                    <Link to={profileHref} className="text-sm font-semibold text-text transition-colors hover:text-primary">
                      {author?.name || "anonymous"}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-text">{author?.name || "anonymous"}</span>
                  )}
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-text-tertiary">
                    <Clock size={11} />
                    {formatDate(post.createdAt)}
                    {post.status === "draft" && <Badge tone="warning">draft</Badge>}
                  </p>
                </div>
              </div>

              <div className="relative" ref={openMenuId === postId ? menuRef : undefined}>
                <button
                  onClick={() => setOpenMenuId((id) => (id === postId ? null : postId))}
                  aria-label="Post options"
                  className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-micro hover:bg-surface-hover hover:text-text"
                >
                  <MoreHorizontal size={16} />
                </button>

                {openMenuId === postId && (
                  <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-md border border-border bg-surface shadow-md">
                    {isMine ? (
                      <>
                        <Link to={`/post/${postId}`} onClick={() => setOpenMenuId(null)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-text hover:bg-surface-hover">
                          <Pencil size={14} /> View / Edit
                        </Link>
                        <button onClick={() => handleDelete(postId)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10">
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    ) : (
                      <button onClick={() => { setOpenMenuId(null); handleShare(postId); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-text hover:bg-surface-hover">
                        <Link2 size={14} /> Copy link
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CONTENT */}
            <div className="space-y-2 px-5">
              <Link to={`/post/${postId}`}>
                <h2 className="font-display text-lg text-text transition-colors hover:text-primary">{post.title}</h2>
              </Link>
              <p className="text-sm leading-relaxed text-text-secondary">{post.description}</p>
            </div>

            {thumbnail && !imageErrors[postId] && (
              <div className="mt-5 w-full">
                <img
                  src={thumbnail}
                  alt={post.title}
                  onError={() => setImageErrors((p) => ({ ...p, [postId]: true }))}
                  className="max-h-[420px] w-full object-cover"
                />
              </div>
            )}

            {post.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2 px-5 pt-5">
                {post.techStack.map((tech: string) => (
                  <Badge key={tech} tone="accent">{tech}</Badge>
                ))}
              </div>
            )}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 px-5 pt-3 font-mono text-xs text-text-tertiary">
                {post.tags.map((tag: any) => (
                  <span key={tag.name}>#{tag.name}</span>
                ))}
              </div>
            )}

            <div className="flex justify-end px-5 pt-4 font-mono text-xs text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <Eye size={13} /> {post.viewCount}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex items-center justify-around border-t border-border px-5 py-3">
              <button
                onClick={() => handleLikeClick(postId)}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-micro ${
                  state.liked ? "text-warning" : "text-text-secondary hover:text-warning"
                }`}
              >
                <Star size={16} fill={state.liked ? "currentColor" : "none"} strokeWidth={1.75} />
                {state.count}
              </button>

              <button
                onClick={() => setActiveCommentPostId(postId)}
                className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-micro hover:text-primary"
              >
                <MessageCircle size={16} strokeWidth={1.75} />
                {commentCounts[postId] ?? 0}
              </button>

              <button
                onClick={() => toggleBookmark(postId)}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-micro ${
                  isBookmarked(postId) ? "text-primary" : "text-text-secondary hover:text-primary"
                }`}
              >
                <BookmarkIcon size={16} fill={isBookmarked(postId) ? "currentColor" : "none"} strokeWidth={1.75} />
                {isBookmarked(postId) ? "Saved" : "Bookmark"}
              </button>

              <button
                onClick={() => handleShare(postId)}
                className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-micro hover:text-primary"
              >
                {copiedId === postId ? <Check size={16} className="text-success" /> : <Share2 size={16} strokeWidth={1.75} />}
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
          onCommentCountChange={(count) => setCommentCounts((prev) => ({ ...prev, [activeCommentPostId]: count }))}
        />
      )}
    </div>
  );
};

export default PostContainer;