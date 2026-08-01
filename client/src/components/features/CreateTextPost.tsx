import { useRef, useState } from "react";
import { Image as ImageIcon, X, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTextPost } from "../../hooks/useTextPost";

const CreateTextPost = () => {
  const { user } = useAuth();
  const { addPost } = useTextPost();

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", trimmed);
      if (imageFile) formData.append("image", imageFile);

      await addPost(formData);

      setText("");
      removeImage();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-3">
        {user?.profile_url ? (
          <img src={user.profile_url} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {getInitials(user?.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are you building today?"
            rows={2}
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />

          {imagePreview && (
            <div className="relative mt-3 w-fit">
              <img src={imagePreview} className="max-h-48 rounded-xl object-cover" />
              <button
                onClick={removeImage}
                className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:bg-surface-hover hover:text-primary"
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
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={14} />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTextPost;