// src/components/features/TextPostContainer.tsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Trash2 } from "lucide-react";
import { useTextPost } from "../../hooks/useTextPost";
import { useAuth } from "../../hooks/useAuth";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString();
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const TextPostContainer = () => {
  const { posts, isLoading, getPosts, toggleLike, removePost } = useTextPost();
  const { user } = useAuth();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    await removePost(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-display text-lg text-text">No posts yet</p>
        <p className="text-sm text-text-secondary">Be the first to share something.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {posts.map((post) => {
        const author = post.userId;
        const profileHref = author?.username ? `/profile/${author.username}` : null;
        const isLiked = !!user?._id && post.likes?.some((id) => String(id) === String(user._id));
        const isMine = !!user?._id && author?._id === user._id;

        return (
          <article
            key={post._id}
            className="overflow-hidden rounded-md border border-border bg-surface transition-colors duration-micro hover:border-border-strong"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {profileHref ? (
                  <Link to={profileHref}>
                    {author?.profile_url ? (
                      <img
                        src={author.profile_url}
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                      />
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
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>

              {isMine && (
                <button
                  onClick={() => handleDelete(post._id)}
                  aria-label="Delete post"
                  className="flex h-8 w-8 items-center justify-center rounded text-text-secondary transition-colors duration-micro hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            <div className="px-5 pb-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.text}</p>
            </div>

            {post.imageUrl && (
              <div className="w-full">
                <img src={post.imageUrl} alt="" className="max-h-[500px] w-full object-cover" />
              </div>
            )}

            <div className="mt-1 flex items-center border-t border-border px-5 py-3">
              <button
                onClick={() => toggleLike(post._id)}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-micro ${
                  isLiked ? "text-danger" : "text-text-secondary hover:text-danger"
                }`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.75} />
                {post.likeCount}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default TextPostContainer;