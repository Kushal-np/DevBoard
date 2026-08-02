import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark as BookmarkIcon, Star, Eye, Clock } from "lucide-react";
import { useBookmark } from "../hooks/useBookmark";

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
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const Bookmarks = () => {
  const { bookmarks, isLoading, fetchBookmarks, toggle } = useBookmark();
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    await toggle(id);
    setRemovingId(null);
  };

  return (
    <div className="w-full md:max-w-2xl md:mx-auto">
      {/* PAGE HEADER */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md md:rounded-t-2xl md:border md:border-b-0 md:px-5">
        <BookmarkIcon size={18} className="text-primary" />
        <h1 className="font-display text-lg font-semibold text-text">Bookmarks</h1>
        {bookmarks.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {bookmarks.length}
          </span>
        )}
      </div>

      <div className="border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookmarkIcon className="mb-3 h-8 w-8 text-text-secondary/40" />
            <p className="text-sm text-text-secondary">
              Nothing saved yet. Bookmark a project to find it here later.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {bookmarks.map((post: any) => {
              const author = post.userId;
              const profileHref = author?.username ? `/profile/${author.username}` : null;

              return (
                <article
                  key={post._id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:shadow-md"
                >
                  {/* HEADER — matches PostContainer's card layout */}
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white">
                              {getInitials(author?.name)}
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white">
                          {getInitials(author?.name)}
                        </div>
                      )}

                      <div>
                        {profileHref ? (
                          <Link to={profileHref} className="font-semibold text-text transition hover:text-primary">
                            {author?.name || "anonymous"}
                          </Link>
                        ) : (
                          <span className="font-semibold text-text">{author?.name || "anonymous"}</span>
                        )}
                        <p className="flex items-center gap-1 text-sm text-text-secondary">
                          <Clock size={12} />
                          {timeAgo(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(post._id)}
                      disabled={removingId === post._id}
                      aria-label="Remove bookmark"
                      className="rounded-full p-1.5 text-primary transition hover:bg-primary/10 disabled:opacity-50"
                    >
                      <BookmarkIcon size={18} fill="currentColor" />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-3 px-5">
                    <Link to={`/post/${post._id}`}>
                      <h2 className="font-display text-xl font-semibold text-text transition hover:text-primary">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-text-secondary leading-relaxed line-clamp-3">{post.description}</p>
                  </div>

                  {post.thumbnailUrl && (
                    <div className="mt-5 w-full">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="max-h-[320px] w-full object-cover"
                      />
                    </div>
                  )}

                  {post.techStack && post.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-5 pt-5">
                      {post.techStack.slice(0, 6).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border px-5 py-3 mt-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      {post.starCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.viewCount} views
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
