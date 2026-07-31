// src/pages/Post.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Send } from "lucide-react";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";

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

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [starCount, setStarCount] = useState(0);

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
        const res = await apiClient.get(`/comments/post/${postId}`);
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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

  const handleCommentSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !postId || isSubmitting) return;

    setIsSubmitting(true);
    setCommentError(null);

    try {
      const res = await apiClient.post(`/comments/post/${postId}`, {
        text: trimmed,
      });

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Post not found</p>
      </div>
    );
  }

  const author = post.userId;
  const profileHref = author?.username ? `/profile/${author.username}` : null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        {/* POST CARD */}
        <article className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* USER HEADER */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {profileHref ? (
                <Link to={profileHref}>
                  {author?.profile_url ? (
                    <img
                      src={author.profile_url}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {getInitials(author?.name)}
                    </div>
                  )}
                </Link>
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {getInitials(author?.name)}
                </div>
              )}

              <div>
                {profileHref ? (
                  <Link
                    to={profileHref}
                    className="text-text font-semibold hover:text-primary transition"
                  >
                    {author?.name || "anonymous"}
                  </Link>
                ) : (
                  <h3 className="text-text font-semibold">
                    {author?.name || "anonymous"}
                  </h3>
                )}

                <p className="text-sm text-text-secondary">
                  @{author?.username || "unknown"}
                </p>
              </div>
            </div>

            <span className="text-xs text-text-secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* CONTENT */}
          <div className="px-5 space-y-4">
            <h1 className="text-xl font-display font-semibold text-text">
              {post.title}
            </h1>

            <p className="text-text-secondary leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* IMAGE */}
          {post.thumbnailUrl && (
            <div className="mt-5 w-full">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
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
            <span>👁 {post.viewCount} views</span>
          </div>

          {/* ACTIONS */}
          <div className="border-t border-border px-5 py-3 flex justify-around">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 transition ${
                liked ? "text-warning" : "text-text-secondary hover:text-warning"
              }`}
            >
              <Star size={16} fill={liked ? "currentColor" : "none"} />
              {starCount}
            </button>

            <span className="text-text-secondary">
              💬 {comments.length} comments
            </span>

            <button className="text-text-secondary hover:text-primary transition">
              🔗 Share
            </button>
          </div>
        </article>

        {/* COMMENT SECTION */}
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* INPUT */}
          <div className="flex items-end gap-2 p-4 border-b border-border">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />

            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || isSubmitting}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-hover"
            >
              <Send size={16} />
            </button>
          </div>

          {commentError && (
            <p className="px-4 pt-3 text-xs text-danger">{commentError}</p>
          )}

          {/* LIST */}
          <div className="p-4 space-y-4">
            {commentsLoading ? (
              <p className="text-center text-sm text-text-secondary">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm text-text-secondary">
                No comments yet. Be the first to say something.
              </p>
            ) : (
              comments.map((comment) => {
                const commenter = comment.userId;
                const commenterHref = commenter?.username
                  ? `/profile/${commenter.username}`
                  : null;

                return (
                  <div key={comment._id} className="flex items-start gap-3">
                    {commenterHref ? (
                      <Link to={commenterHref}>
                        {commenter?.profile_url ? (
                          <img
                            src={commenter.profile_url}
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {getInitials(commenter?.name)}
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {getInitials(commenter?.name)}
                      </div>
                    )}

                    <div className="min-w-0">
                      {commenterHref ? (
                        <Link
                          to={commenterHref}
                          className="text-sm font-semibold text-text hover:text-primary transition"
                        >
                          {commenter?.name || "anonymous"}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-text">
                          {commenter?.name || "anonymous"}
                        </p>
                      )}

                      <p className="text-sm text-text-secondary break-words">
                        {comment.text}
                      </p>
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