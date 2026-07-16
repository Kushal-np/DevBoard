// src/components/features/PostContainer.tsx

import { useEffect, useState, useRef } from "react";
import { useFeed } from "../../hooks/useFeed";
import {
    ExternalLink,
    Layers,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Clock,
    MoreHorizontal,
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
    const { posts, getPosts, isLoading, Likepost } = useFeed();
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
                setVisiblePosts((prev) => Math.min(prev + 3, posts?.length || 0));
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
        if (typeof thumbnail === "string") return thumbnail;
        if (thumbnail instanceof File) {
            try {
                return URL.createObjectURL(thumbnail);
            } catch {
                return null;
            }
        }
        return null;
    };

    const handleImageError = (postId: string) => {
        setImageErrors((prev) => ({ ...prev, [postId]: true }));
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diff < 60) return `${diff}s`;
            if (diff < 3600) return `${Math.floor(diff / 60)}m`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
            if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

            return new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(date);
        } catch {
            return "";
        }
    };

    const getStatusStyles = (status?: string) => {
        switch (status) {
            case "draft":
                return "bg-warning/10 text-warning border-warning/20";
            case "archived":
                return "bg-danger/10 text-danger border-danger/20";
            default:
                return "";
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const safePosts = Array.isArray(posts)
        ? posts.filter((post) => post?.title && post.title.trim() !== "")
        : [];

    const displayedPosts = safePosts.slice(0, visiblePosts);

    if (isLoading) {
        return (
            <div className="flex flex-col divide-y divide-border/60">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3 px-4 py-5 md:px-1">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-surface-hover" />
                        <div className="flex-1 space-y-2.5">
                            <div className="h-3 w-32 animate-pulse rounded bg-surface-hover" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-surface-hover" />
                            <div className="h-3 w-full animate-pulse rounded bg-surface-hover" />
                            <div className="h-32 w-full animate-pulse rounded-xl bg-surface-hover" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (safePosts.length === 0) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
                    <Layers size={26} className="text-text-secondary/50" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="font-display text-lg font-semibold text-text">
                        Nothing here yet
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                        Projects shared by the community will show up in this feed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {displayedPosts.map((post: any, index: number) => {
                const postId = getPostId(post);
                const thumbnailUrl = getThumbnailUrl(post);
                const hasImageError = imageErrors[postId];
                const showThumbnail = thumbnailUrl && !hasImageError;
                const isLast = index === displayedPosts.length - 1;
                const statusStyle = getStatusStyles(post?.status);

                return (
                    <article
                        key={postId || index}
                        ref={isLast ? lastPostRef : null}
                        className="group relative border-b border-border/60 last:border-b-0"
                    >
                        {/* signature: accent bar draws in on hover, editor-tab style */}
                        <span className="absolute left-0 top-0 h-full w-[2px] scale-y-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-y-100" />

                        <div className="px-4 py-5 transition-colors duration-200 md:px-5 md:group-hover:bg-surface/40">
                            {/* Header */}
                            <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                    {post?.userId?.profile_url ? (
                                        <img
                                            src={post.userId?.profile_url}
                                            alt={post.userId?.username}
                                            className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary ring-1 ring-border">
                                            {getInitials(post?.author?.username)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[12.5px]">
                                    <span className="truncate font-medium text-text">
                                        {post?.userId.name || "anonymous"}
                                    </span>
                                    <span className="text-text-secondary/40">·</span>
                                    <span className="flex shrink-0 items-center gap-1 text-text-secondary/70">
                                        <Clock size={11} />
                                        {formatDate(post?.createdAt?.toString())}
                                    </span>
                                    {post?.status && post.status !== "published" && (
                                        <span
                                            className={`ml-1 rounded-full border px-2 py-0.5 text-[10px] font-sans tracking-wide ${statusStyle}`}
                                        >
                                            {post.status}
                                        </span>
                                    )}
                                </div>

                                <button
                                    aria-label="More options"
                                    className="shrink-0 rounded-full p-1.5 text-text-secondary/50 transition hover:bg-surface-hover hover:text-text"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="mt-3 pl-12">
                                <h2 className="font-display text-[17px] font-semibold leading-snug text-text">
                                    {post?.title}
                                </h2>

                                <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary line-clamp-3">
                                    {post?.description}
                                </p>

                                {showThumbnail && (
                                    <div className="mt-3 overflow-hidden rounded-xl border border-border">
                                        <img
                                            src={thumbnailUrl}
                                            alt={post?.title}
                                            className="h-52 w-full object-cover"
                                            onError={() => handleImageError(postId)}
                                        />
                                    </div>
                                )}

                                {post?.techStack && post.techStack.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {post.techStack.slice(0, 5).map((tech: string, idx: number) => (
                                            <span
                                                key={`${tech}-${idx}`}
                                                className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {post.techStack.length > 5 && (
                                            <span className="rounded-md px-2 py-0.5 font-mono text-[11px] text-text-secondary/60">
                                                +{post.techStack.length - 5}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-4 flex items-center gap-1">
                                    <button className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-text-secondary transition hover:bg-danger/10 hover:text-danger">
                                        <button
                                            onClick={() => Likepost(post._id)}
                                            className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs transition ${post.isLiked
                                                    ? "text-red-500"
                                                    : "text-text-secondary hover:bg-danger/10 hover:text-danger"
                                                }`}
                                        >
                                            <Heart
                                                size={16}
                                                strokeWidth={1.75}
                                                fill={post.isLiked ? "currentColor" : "none"}
                                            />
                                            <span className="font-mono">{post.starCount}</span>
                                        </button>
                                    </button>

                                    <button className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-text-secondary transition hover:bg-primary/10 hover:text-primary">
                                        <MessageCircle size={16} strokeWidth={1.75} />
                                        <span className="font-mono">0</span>
                                    </button>

                                    <button
                                        aria-label="Share"
                                        className="rounded-full p-1.5 text-text-secondary transition hover:bg-primary/10 hover:text-primary"
                                    >
                                        <Share2 size={16} strokeWidth={1.75} />
                                    </button>

                                    <button
                                        aria-label="Views"
                                        className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-text-secondary transition hover:bg-surface-hover"
                                    >
                                        <Eye size={16} strokeWidth={1.75} />
                                        <span className="font-mono">{post?.viewCount || 0}</span>
                                    </button>

                                    <div className="ml-auto flex items-center gap-2">
                                        {post?.liveUrl && (
                                            <a
                                                href={post.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-hover"
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
                                                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-text-secondary/40 hover:text-text"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                                Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                );
            })}

            {visiblePosts < safePosts.length && (
                <div className="flex justify-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                </div>
            )}
        </div>
    );
};

export default PostContainer;