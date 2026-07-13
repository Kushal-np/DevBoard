// src/components/features/PostContent.tsx

import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Link2,
  Tag,
  Layers,
  X,
  Loader2,
  User,
  Upload,
  Plus,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { useAuth } from "../../hooks/useAuth";

type PostStatus = "draft" | "published" | "archived";

interface Tag {
  name: string;
  category: string;
}

interface FormState {
  title: string;
  description: string;
  liveUrl: string;
  repoUrl: string;
  status: PostStatus;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  liveUrl: "",
  repoUrl: "",
  status: "published",
};

const DESCRIPTION_LIMIT = 500;

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<PostStatus, string> = {
  draft: "border-warning/40 bg-warning/15 text-warning",
  published: "border-success/40 bg-success/15 text-success",
  archived: "border-danger/40 bg-danger/15 text-danger",
};

const TAG_CATEGORIES = [
  "Framework",
  "Language",
  "Tool",
  "Platform",
  "Database",
  "Cloud",
  "Design",
  "Testing",
  "DevOps",
  "Security",
  "Other",
];

/* ---------- Tag input with category ---------- */

interface TagFieldProps {
  tags: Tag[];
  onAdd: (tag: Tag) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}

const TagField = ({ tags, onAdd, onRemove, placeholder }: TagFieldProps) => {
  const [tagName, setTagName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(TAG_CATEGORIES[0]);
  const [isAdding, setIsAdding] = useState(false);

  const commit = () => {
    const trimmed = tagName.trim();
    if (trimmed && !tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      onAdd({ name: trimmed, category: selectedCategory });
      setTagName("");
      setSelectedCategory(TAG_CATEGORIES[0]);
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
      return;
    }
    if (e.key === "Backspace" && tagName === "" && tags.length > 0) {
      onRemove(tags.length - 1);
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setTagName("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
      {tags.map((tag, i) => (
        <span
          key={`${tag.name}-${i}`}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          <span>{tag.name}</span>
          <span className="text-[10px] text-text-secondary/60">· {tag.category}</span>
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`Remove ${tag.name}`}
            className="text-text-secondary transition hover:text-danger"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      
      {!isAdding && tags.length === 0 && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
        >
          <Plus size={14} />
          {placeholder}
        </button>
      )}

      {isAdding && (
        <div className="flex flex-1 items-center gap-2">
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (tagName.trim()) {
                commit();
              } else {
                setIsAdding(false);
              }
            }}
            placeholder="Tag name..."
            className="min-w-[80px] flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary focus:outline-none"
            autoFocus
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs text-text-secondary focus:outline-none"
          >
            {TAG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

/* ---------- Chip input for tech stack ---------- */

interface ChipFieldProps {
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  mono?: boolean;
}

const ChipField = ({ values, onAdd, onRemove, placeholder, mono }: ChipFieldProps) => {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) onAdd(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
      return;
    }
    if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onRemove(values.length - 1);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
      {values.map((v, i) => (
        <span
          key={`${v}-${i}`}
          className={`flex items-center gap-1.5 rounded-lg bg-surface-hover px-2.5 py-1 text-xs font-medium text-text ${
            mono ? "font-mono" : ""
          }`}
        >
          {v}
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`Remove ${v}`}
            className="text-text-secondary transition hover:text-danger"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={values.length === 0 ? placeholder : ""}
        className={`min-w-[120px] flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary focus:outline-none ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
};

/* ---------- Toolbar icon button ---------- */

interface ActionIconProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}

const ActionIcon = ({ icon, active, onClick, label }: ActionIconProps) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
      active
        ? "bg-primary/15 text-primary"
        : "text-text-secondary hover:bg-surface-hover hover:text-primary"
    }`}
  >
    {icon}
  </button>
);

/* ---------- Main component ---------- */

const PostContent = () => {
  const { CreatePost, getPosts, isLoading } = useFeed();
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [showThumbnail, setShowThumbnail] = useState(false);
  const [showLiveUrl, setShowLiveUrl] = useState(false);
  const [showRepoUrl, setShowRepoUrl] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const feedbackTimeout = useRef<number | undefined>(undefined);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const notify = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = window.setTimeout(() => setFeedback(null), 3200);
  };

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setTechStack([]);
    setTags([]);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setShowThumbnail(false);
    setShowLiveUrl(false);
    setShowRepoUrl(false);
    setThumbnailError(false);
    setIsExpanded(false);
    if (titleRef.current) titleRef.current.style.height = "auto";
    if (descRef.current) descRef.current.style.height = "auto";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notify("error", "Please select an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image size must be less than 5MB.");
      return;
    }

    setThumbnailFile(file);
    setThumbnailError(false);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const canSubmit = form.title.trim().length > 0 && form.description.trim().length > 0;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!canSubmit || isLoading) return;

  try {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('liveUrl', form.liveUrl || '');
    formData.append('repoUrl', form.repoUrl || '');
    formData.append('status', form.status);
    formData.append('techStack', JSON.stringify(techStack));
    formData.append('tags', JSON.stringify(tags));
    
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    await CreatePost(formData);

    notify("success", "Your project is live.");

    // Force a re-fetch of posts after a delay
    setTimeout(() => {
      getPosts(); // Make sure getPosts is available from useFeed
    }, 1000);

    resetAll();
  } catch (err) {
    console.error(err);
    notify("error", "Couldn't post right now. Try again.");
  }
};

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setThumbnailError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={`relative w-full rounded-2xl border bg-surface p-3 md:max-w-2xl md:mx-auto md:p-4 transition-all duration-300 sm:p-5 ${
        isExpanded ? "border-primary/30 shadow-lg shadow-primary/[0.06]" : "border-border shadow-sm"
      }`}
    >
      {isExpanded && (
        <button
          type="button"
          onClick={resetAll}
          aria-label="Discard post"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-hover hover:text-text"
        >
          <X size={16} />
        </button>
      )}

      {feedback && (
        <div
          className={`mb-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
            feedback.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Avatar + title */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {user?.profile_url ? (
              <img
                src={user.profile_url}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-background ring-2 ring-border">
                <User size={20} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 pt-1.5">
            <textarea
              ref={titleRef}
              name="title"
              value={form.title}
              onChange={(e) => {
                handleChange(e);
                autoGrow(titleRef.current);
              }}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setIsExpanded(true);
                  descRef.current?.focus();
                }
              }}
              placeholder="Share what you're building…"
              rows={1}
              className="w-full resize-none overflow-hidden bg-transparent text-lg font-medium leading-snug text-text placeholder:text-text-secondary/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Expandable section */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-4 pb-1 pt-3 sm:pl-14">
              <div>
                <textarea
                  ref={descRef}
                  name="description"
                  value={form.description}
                  onChange={(e) => {
                    handleChange(e);
                    autoGrow(descRef.current);
                  }}
                  placeholder="What does it do, why did you build it, what's interesting about it?"
                  maxLength={DESCRIPTION_LIMIT}
                  rows={2}
                  className="w-full resize-none overflow-hidden bg-transparent text-sm leading-relaxed text-text placeholder:text-text-secondary/70 focus:outline-none"
                />
                <div className="mt-1 flex justify-end">
                  <span
                    className={`text-xs tabular-nums ${
                      form.description.length > DESCRIPTION_LIMIT - 40
                        ? "text-warning"
                        : "text-text-secondary"
                    }`}
                  >
                    {form.description.length}/{DESCRIPTION_LIMIT}
                  </span>
                </div>
              </div>

              {(showThumbnail || thumbnailFile || thumbnailPreview) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                    <ImageIcon size={16} className="shrink-0 text-text-secondary" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="flex-1 bg-transparent text-sm text-text file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 focus:outline-none"
                    />
                    <Upload size={16} className="shrink-0 text-text-secondary" />
                  </div>

                  {thumbnailPreview && !thumbnailError && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-background">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        onError={() => setThumbnailError(true)}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        aria-label="Remove thumbnail"
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-overlay text-background backdrop-blur transition hover:bg-danger"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {thumbnailError && (
                    <p className="text-xs text-danger">Couldn't load the image. Please try another file.</p>
                  )}

                  {thumbnailFile && !thumbnailError && !thumbnailPreview && (
                    <p className="text-xs text-text-secondary">
                      Selected: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              )}

              {(showLiveUrl || form.liveUrl) && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                  <Link2 size={16} className="shrink-0 text-text-secondary" />
                  <input
                    name="liveUrl"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="Live demo URL"
                    className="flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary focus:outline-none"
                  />
                </div>
              )}

              {(showRepoUrl || form.repoUrl) && (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                  <input
                    name="repoUrl"
                    value={form.repoUrl}
                    onChange={handleChange}
                    placeholder="GitHub repository URL"
                    className="flex-1 bg-transparent text-sm text-text placeholder:text-text-secondary focus:outline-none"
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                    <Layers size={13} />
                    Tech stack
                  </label>
                  <ChipField
                    values={techStack}
                    onAdd={(v) => setTechStack((prev) => [...prev, v])}
                    onRemove={(i) => setTechStack((prev) => prev.filter((_, idx) => idx !== i))}
                    placeholder="React, Node, MongoDB…"
                    mono
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                    <Tag size={13} />
                    Tags
                  </label>
                  <TagField
                    tags={tags}
                    onAdd={(tag) => setTags((prev) => [...prev, tag])}
                    onRemove={(i) => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                    placeholder="Add a tag..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Status
                </label>
                <div className="inline-flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, status: opt.value }))}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                        form.status === opt.value
                          ? STATUS_STYLES[opt.value]
                          : "border-border text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-0.5">
            <ActionIcon
              icon={<ImageIcon size={18} />}
              active={showThumbnail || !!thumbnailFile}
              onClick={() => {
                setIsExpanded(true);
                setShowThumbnail((s) => !s);
                if (!showThumbnail && !thumbnailFile) {
                  setTimeout(() => fileInputRef.current?.focus(), 100);
                }
              }}
              label="Add thumbnail"
            />
            <ActionIcon
              icon={<Link2 size={18} />}
              active={showLiveUrl || !!form.liveUrl}
              onClick={() => {
                setIsExpanded(true);
                setShowLiveUrl((s) => !s);
              }}
              label="Add live URL"
            />

            <ActionIcon
              icon={<Layers size={18} />}
              active={techStack.length > 0}
              onClick={() => setIsExpanded(true)}
              label="Tech stack"
            />
            <ActionIcon
              icon={<Tag size={18} />}
              active={tags.length > 0}
              onClick={() => setIsExpanded(true)}
              label="Tags"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            {isLoading ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostContent;