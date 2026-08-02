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
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
          <div key={i} className="h-40 rounded-2xl bg-surface animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-text-secondary">
        No posts yet. Be the first to share something.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {posts.map((post) => {
        const author = post.userId;
        const profileHref = author?.username ? `/profile/${author.username}` : null;
        const isLiked = !!user?._id && post.likes?.some((id) => String(id) === String(user._id));
        const isMine = !!user?._id && author?._id === user._id;

        return (
          <article
            key={post._id}
            className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
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
                      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
                        {getInitials(author?.name)}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
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
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>

              {isMine && (
                <button
                  onClick={() => handleDelete(post._id)}
                  aria-label="Delete post"
                  className="rounded-full p-1.5 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="px-5 pb-4">
              <p className="text-text leading-relaxed whitespace-pre-wrap">{post.text}</p>
            </div>

            {post.imageUrl && (
              <div className="w-full">
                <img src={post.imageUrl} alt="" className="w-full max-h-[500px] object-cover" />
              </div>
            )}

            <div className="border-t border-border px-5 py-3 flex items-center gap-6">
              <button
                onClick={() => toggleLike(post._id)}
                className={`flex items-center gap-1.5 text-sm transition ${
                  isLiked ? "text-danger" : "text-text-secondary hover:text-danger"
                }`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
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
