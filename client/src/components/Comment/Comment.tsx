// src/components/Comment/Comment.tsx

import { useEffect, useState } from "react";
import { X, Send, Trash2 } from "lucide-react";
import apiClient from "../../api/axiosConfig";
import { COMMENT_ENDPOINTS } from "../../api/endpoints";
import { useAuth } from "../../hooks/useAuth";

interface CommentUser {
  _id: string;
  name: string;
  username: string;
  profile_url?: string;
}

interface IComment {
  _id: string;
  text: string;
  userId: CommentUser;
  createdAt: string;
}

interface CommentModalProps {
  postId: string;
  onClose: () => void;
  onCommentCountChange?: (count: number) => void;
}

const CommentModal = ({ postId, onClose, onCommentCountChange }: CommentModalProps) => {
  const { user } = useAuth();

  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(COMMENT_ENDPOINTS.LIST(postId));
        if (!cancelled) {
          const list = res.data?.comments ?? [];
          setComments(list);
          onCommentCountChange?.(list.length);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Couldn't load comments.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
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

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await apiClient.post(COMMENT_ENDPOINTS.CREATE(postId), {
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

      setComments((prev) => {
        const next = [newComment, ...prev];
        onCommentCountChange?.(next.length);
        return next;
      });
      setText("");
    } catch (err) {
      setError("Couldn't post your comment. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = comments;
    setComments((c) => {
      const next = c.filter((cm) => cm._id !== id);
      onCommentCountChange?.(next.length);
      return next;
    });
    try {
      await apiClient.delete(COMMENT_ENDPOINTS.DELETE(id));
    } catch (err) {
      setComments(prev);
      onCommentCountChange?.(prev.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-bold text-text">Comments</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition hover:bg-background hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-text-secondary">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-text-secondary">
              No comments yet. Be the first to say something.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3 group">
                {comment.userId?.profile_url ? (
                  <img
                    src={comment.userId.profile_url}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                    {getInitials(comment.userId?.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text">
                    {comment.userId?.name || "anonymous"}
                  </p>
                  <p className="text-sm text-text-secondary break-words">{comment.text}</p>
                </div>

                {user?._id === comment.userId?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    aria-label="Delete comment"
                    className="shrink-0 rounded-full p-1 text-text-secondary opacity-0 transition hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))
          )}

          {error && <p className="text-center text-xs text-danger">{error}</p>}
        </div>

        {/* INPUT */}
        <div className="flex items-end gap-2 border-t border-border p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-hover"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
