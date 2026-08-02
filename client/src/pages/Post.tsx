import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Send, Eye, Share2, Check, Trash2 } from "lucide-react";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS, COMMENT_ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import { useFeed } from "../hooks/useFeed";
import Badge from "../components/ui/Badge";

interface IComment {
  _id: string;
  text: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    profile_url?: string;
  };
  createdAt: string;
}

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const { DeletePost } = useFeed();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await apiClient.get(POST_ENDPOINTS.GET_INDIVIDUAL_POST(postId));
        const fetchedPost = res.data.post;

        setPost(fetchedPost);
        setStarCount(fetchedPost?.starCount ?? fetchedPost?.stars?.length ?? 0);
        setLiked(
          !!user?._id &&
            Array.isArray(fetchedPost?.stars) &&
            fetchedPost.stars.some((id: string) => String(id) === String(user._id))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, user?._id]);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setCommentsLoading(true);

      try {
        const res = await apiClient.get(COMMENT_ENDPOINTS.LIST(postId));
        setComments(res.data?.comments ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleLikeClick = async () => {
    if (!postId) return;

    const prevLiked = liked;
    const prevCount = starCount;

    setLiked(!prevLiked);
    setStarCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      await apiClient.post(POST_ENDPOINTS.STAR_POST(postId));
    } catch (error) {
      setLiked(prevLiked);
      setStarCount(prevCount);
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  };

  const handleDelete = async () => {
    if (!postId || !window.confirm("Delete this project? This can't be undone.")) return;
    try {
      await DeletePost(postId);
      navigate("/feed");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !postId || isSubmitting) return;

    setIsSubmitting(true);
    setCommentError(null);

    try {
      const res = await apiClient.post(COMMENT_ENDPOINTS.CREATE(postId), { text: trimmed });

      const newComment: IComment = res.data?.comment ?? {
        _id: crypto.randomUUID(),
        text: trimmed,
        userId: {
          _id: user?._id ?? "",
          name: user?.name ?? "You",
          username: user?.username ?? "",
          profile_url: user?.profile_url,
        },
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (error) {
      setCommentError("Couldn't post your comment. Try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-xl space-y-4 px-4">
          <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
          <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background text-center">
        <p className="font-display text-lg text-text">Project not found</p>
        <p className="text-sm text-text-secondary">It may have been removed, or the link is off.</p>
      </div>
    );
  }

  const author = post.userId;
  const profileHref = author?.username ? `/profile/${author.username}` : null;
  const isMine = !!user?._id && author?._id === user._id;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-xl space-y-6">
        {/* POST CARD */}
        <article className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {profileHref ? (
                <Link to={profileHref}>
                  {author?.profile_url ? (
                    <img src={author.profile_url} className="h-11 w-11 rounded-full object-cover ring-1 ring-border" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono font-medium text-primary">
                      {getInitials(author?.name)}
                    </div>
                  )}
                </Link>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-mono font-medium text-primary">
                  {getInitials(author?.name)}
                </div>
              )}

              <div>
                {profileHref ? (
                  <Link to={profileHref} className="font-semibold text-text transition-colors duration-150 hover:text-primary">
                    {author?.name || "anonymous"}
                  </Link>
                ) : (
                  <h3 className="font-semibold text-text">{author?.name || "anonymous"}</h3>
                )}
                <p className="font-mono text-xs text-text-secondary">@{author?.username || "unknown"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              {isMine && (
                <button
                  onClick={handleDelete}
                  aria-label="Delete project"
                  className="rounded-full p-1.5 text-text-secondary transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 px-5">
            <h1 className="font-display text-xl font-semibold tracking-tight text-text">{post.title}</h1>
            <p className="leading-relaxed text-text-secondary">{post.description}</p>
          </div>

          {post.thumbnailUrl && (
            <div className="mt-5 w-full">
              <img src={post.thumbnailUrl} alt={post.title} className="max-h-[450px] w-full object-cover" />
            </div>
          )}

          {post.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-2 px-5 pt-5">
              {post.techStack.map((tech: string) => (
                <Badge key={tech} tone="accent">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 px-5 pt-3 font-mono text-xs text-text-secondary">
              {post.tags.map((tag: any) => (
                <span key={tag.name}>#{tag.name}</span>
              ))}
            </div>
          )}

          <div className="flex justify-end px-5 pt-4 font-mono text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Eye size={13} />
              {post.viewCount} views
            </span>
          </div>

          <div className="mt-3 flex items-center justify-around border-t border-border px-5 py-3">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 text-sm transition-colors duration-150 ${
                liked ? "text-warning" : "text-text-secondary hover:text-warning"
              }`}
            >
              <Star size={16} fill={liked ? "currentColor" : "none"} strokeWidth={1.75} />
              {starCount}
            </button>

            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Send size={15} strokeWidth={1.75} />
              {comments.length} comments
            </span>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-text-secondary transition-colors duration-150 hover:text-primary"
            >
              {copied ? <Check size={16} className="text-success" /> : <Share2 size={16} strokeWidth={1.75} />}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </article>

        {/* COMMENT SECTION */}
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-end gap-2 border-b border-border p-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none transition-colors duration-150 focus:border-primary"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || isSubmitting}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg transition-colors duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>

          {commentError && <p className="px-4 pt-3 font-mono text-xs text-danger">{commentError}</p>}

          <div className="space-y-4 p-4">
            {commentsLoading ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-background" />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-secondary">
                No comments yet. Be the first to say something.
              </p>
            ) : (
              comments.map((comment) => {
                const commenter = comment.userId;
                const commenterHref = commenter?.username ? `/profile/${commenter.username}` : null;

                return (
                  <div key={comment._id} className="flex items-start gap-3">
                    {commenterHref ? (
                      <Link to={commenterHref}>
                        {commenter?.profile_url ? (
                          <img src={commenter.profile_url} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-medium text-primary">
                            {getInitials(commenter?.name)}
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-medium text-primary">
                        {getInitials(commenter?.name)}
                      </div>
                    )}

                    <div className="min-w-0">
                      {commenterHref ? (
                        <Link to={commenterHref} className="text-sm font-semibold text-text transition-colors duration-150 hover:text-primary">
                          {commenter?.name || "anonymous"}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-text">{commenter?.name || "anonymous"}</p>
                      )}
                      <p className="break-words text-sm text-text-secondary">{comment.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Post;