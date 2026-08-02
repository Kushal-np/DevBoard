import { useRef, useState } from "react";
import { Image as ImageIcon, X, Send, Pencil } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTextPost } from "../../hooks/useTextPost";

const MAX_LENGTH = 500;

const CreateTextPost = () => {
  const { user } = useAuth();
  const { addPost } = useTextPost();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetAndClose = () => {
    setText("");
    setError(null);
    removeImage();
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("text", trimmed);
      if (imageFile) formData.append("image", imageFile);

      await addPost(formData);
      resetAndClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't publish your post. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remaining = MAX_LENGTH - text.length;
  const nearLimit = remaining <= 40;

  return (
    <>
      {/* TRIGGER BAR */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition hover:border-primary/40"
      >
        {user?.profile_url ? (
          <img src={user.profile_url} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
            {getInitials(user?.name)}
          </div>
        )}

        <span className="flex-1 font-mono text-sm text-text-secondary">
          <span className="text-primary">{">"}</span> what's on your mind today?
        </span>

        <Pencil size={16} className="shrink-0 text-text-secondary" />
      </button>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={resetAndClose}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-bold text-text">Create post</h3>
              <button
                onClick={resetAndClose}
                className="rounded-full p-1 text-text-secondary transition hover:bg-background hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex gap-3">
                {user?.profile_url ? (
                  <img src={user.profile_url} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {getInitials(user?.name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">{user?.name}</p>
                  <p className="font-mono text-xs text-text-secondary">@{user?.username}</p>
                </div>
              </div>

              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="What's on your mind today?"
                rows={4}
                maxLength={MAX_LENGTH}
                className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />

              <div className="mt-1.5 flex items-center justify-between">
                <div>{error && <p className="text-xs text-danger">{error}</p>}</div>
                <span
                  className={`font-mono text-[11px] ${
                    nearLimit ? "text-danger" : "text-text-secondary"
                  }`}
                >
                  {remaining}
                </span>
              </div>

              {imagePreview && (
                <div className="relative mt-3 w-fit">
                  <img src={imagePreview} className="max-h-56 rounded-xl object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-background hover:text-primary"
              >
                <ImageIcon size={15} />
                Add image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />

              <button
                onClick={handleSubmit}
                disabled={!text.trim() || isSubmitting}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={14} />
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTextPost;