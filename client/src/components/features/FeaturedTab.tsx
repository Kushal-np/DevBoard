
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, Clock, Star } from "lucide-react";
import { useFeed } from "../../hooks/useFeed";

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

const FeaturedTab = () => {
  const { featuredPosts, isFeaturedLoading, getFeatured } = useFeed();

  useEffect(() => {
    getFeatured();
  }, [getFeatured]);

  if (isFeaturedLoading) {
    return (
      <div className="space-y-3 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface animate-pulse" />
        ))}
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Award className="mb-3 h-8 w-8 text-text-secondary/40" />
        <p className="text-sm text-text-secondary">No featured projects yet.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 p-4">
      {featuredPosts.map((post) => {
        const author = post.userId;
        const profileHref = author?.username ? `/profile/${author.username}` : null;

        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="group flex gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-surface p-4 transition hover:border-primary/40 hover:shadow-md"
          >
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award size={22} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Award size={12} />
                Featured
              </div>

              <h3 className="mt-0.5 truncate font-display text-base font-semibold text-text transition group-hover:text-primary">
                {post.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{post.description}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                {profileHref && (
                  <span className="flex items-center gap-1">
                    {author?.profile_url ? (
                      <img src={author.profile_url} className="h-4 w-4 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
                        {getInitials(author?.name)}
                      </span>
                    )}
                    @{author?.username}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {post.starCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {timeAgo(post.createdAt)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FeaturedTab;
