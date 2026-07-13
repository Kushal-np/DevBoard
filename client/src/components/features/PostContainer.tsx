// src/components/features/PostContainer.tsx

import { useEffect, useState, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import { 
  ExternalLink, 
  Tag, 
  Layers, 
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  User,
  MoreHorizontal
} from "lucide-react";

export interface IPost {
  _id: string;
  userId: string;
  title: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  techStack: string[];
  tags: Array<{ name: string; category: string }> | string[];
  thumbnailUrl?: string;
  stars: string[];
  starCount: number;
  viewCount: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  author?: {
    username: string;
    profile_url?: string;
  };
}

const PostContainer = () => {
  const { posts, getPosts, isLoading } = useFeed();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [visiblePosts, setVisiblePosts] = useState<number>(5);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visiblePosts < (posts?.length || 0)) {
        setVisiblePosts(prev => Math.min(prev + 3, posts?.length || 0));
      }
    });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [posts, visiblePosts]);

  const getPostId = (post: any): string => {
    if (!post) return `post-${Math.random()}`;
    return post._id || post.id || `post-${Math.random()}`;
  };

  const getThumbnailUrl = (post: any): string | null => {
    if (!post) return null;
    const thumbnail = post.thumbnail || post.thumbnailUrl || post.thumbnail_url;
    if (!thumbnail) return null;
    if (typeof thumbnail === 'string') return thumbnail;
    if (thumbnail instanceof File) {
      try { return URL.createObjectURL(thumbnail); } 
      catch { return null; }
    }
    return null;
  };

  const getTagName = (tag: any): string => {
    if (!tag) return '';
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag.name) return tag.name;
    return String(tag);
  };

  const getTagCategory = (tag: any): string | null => {
    if (!tag || typeof tag === 'string') return null;
    if (typeof tag === 'object' && tag.category) return tag.category;
    return null;
  };

  const handleImageError = (postId: string) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return '';
    }
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'draft': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'archived': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-surface-hover text-text-secondary border-border';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const safePosts = Array.isArray(posts) 
    ? posts.filter(post => post?.title && post.title.trim() !== '')
    : [];

  const displayedPosts = safePosts.slice(0, visiblePosts);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5 blur-xl" />
        </div>
        <p className="text-sm text-text-secondary/60 animate-pulse">Loading stories...</p>
      </div>
    );
  }

  if (safePosts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border border-border/30">
            <Layers size={32} className="text-text-secondary/30" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-text">No posts yet</p>
          <p className="text-sm text-text-secondary/60 mt-1">Be the first to share your story</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full py-2 md:max-w-3xl md:mx-auto md:py-4">
      {displayedPosts.map((post: any, index: number) => {
        const postId = getPostId(post);
        const thumbnailUrl = getThumbnailUrl(post);
        const hasImageError = imageErrors[postId];
        const showThumbnail = thumbnailUrl && !hasImageError;
        const isLast = index === displayedPosts.length - 1;

        return (
          <div
            key={postId || index}
            ref={isLast ? lastPostRef : null}
            className="group relative"
          >
            {/* Post Content */}
           <div className="px-0 py-4 md:px-2 md:py-5">
              {/* Header */}
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                  {post?.author?.profile_url ? (
                    <img
                      src={post.author.profile_url}
                      alt={post.author.username}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-border/30"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-medium text-primary ring-1 ring-border/30">
                      {getInitials(post?.author?.username)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text">
                      {post?.author?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-text-secondary/40">·</span>
                    <span className="text-xs text-text-secondary/40 flex items-center gap-1">
                      <Clock size={11} />
                      {formatDate(post?.createdAt?.toString())}
                    </span>
                    {post?.status && post.status !== 'published' && (
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border ${getStatusStyles(post.status)}`}>
                        {post.status}
                      </span>
                    )}
                  </div>
                </div>

                <button className="shrink-0 rounded-full p-1.5 text-text-secondary/30 transition hover:bg-surface-hover hover:text-text-secondary">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="mt-3">
                {/* Title */}
                <h2 className="text-xl font-semibold text-text leading-snug transition-colors group-hover:text-primary">
                  {post?.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-text-secondary/70 leading-relaxed line-clamp-3">
                  {post?.description}
                </p>

                {/* Thumbnail */}
                {showThumbnail && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-border/20 bg-background/30">
                    <img
                      src={thumbnailUrl}
                      alt={post?.title}
                      className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      onError={() => handleImageError(postId)}
                    />
                  </div>
                )}

                {/* Tech Stack */}
                {post?.techStack && post.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.techStack.slice(0, 4).map((tech: string, idx: number) => (
                      <span
                        key={`${tech}-${idx}`}
                        className="rounded-full bg-primary/5 px-2.5 py-0.5 text-[10px] font-mono text-primary/70 border border-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {post.techStack.length > 4 && (
                      <span className="rounded-full bg-surface-hover px-2.5 py-0.5 text-[10px] text-text-secondary/50">
                        +{post.techStack.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-text-secondary/50 transition hover:text-rose-400 group/btn">
                  <Heart size={16} className="transition group-hover/btn:scale-110" />
                  <span>{post?.starCount || 0}</span>
                </button>

                <button className="flex items-center gap-1.5 text-xs text-text-secondary/50 transition hover:text-primary">
                  <MessageCircle size={16} />
                  <span>0</span>
                </button>

                <button className="flex items-center gap-1.5 text-xs text-text-secondary/50 transition hover:text-primary">
                  <Share2 size={16} />
                </button>

                <div className="ml-auto flex items-center gap-2">
                  {post?.liveUrl && (
                    <a
                      href={post.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                    >
                      <ExternalLink size={12} />
                      Demo
                    </a>
                  )}
                  {post?.repoUrl && (
                    <a
                      href={post.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-border"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      Code
                    </a>
                  )}
                  <button className="rounded-lg p-1.5 text-text-secondary/30 transition hover:bg-surface-hover hover:text-primary">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal line separator - except for last post */}
            {!isLast && (
              <div className="border-t border-border/40" />
            )}
          </div>
        );
      })}

      {/* Loading more indicator */}
      {visiblePosts < safePosts.length && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary/60" />
        </div>
      )}
    </div>
  );
};

export default PostContainer;