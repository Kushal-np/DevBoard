import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2, User } from "lucide-react";
import ThemeController from "../components/features/ThemeController";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, refreshUser, logout } = useAuth();
  const { updateProfileWithImages, changeUserPassword, removeAccount, isSaving } = useProfile();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.profile_url || null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(user?.cover_url || null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const notify = (type: "success" | "error", text: string) => setStatus({ type, text });

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) return "Please select an image file.";
    if (file.size > 5 * 1024 * 1024) return "Image must be under 5MB.";
    return null;
  };

  const handleProfilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) return notify("error", err);
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) return notify("error", err);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      if (profileFile) formData.append("profile_image", profileFile);
      if (coverFile) formData.append("cover_image", coverFile);

      await updateProfileWithImages(formData);
      await refreshUser();
      setProfileFile(null);
      setCoverFile(null);
      notify("success", "Profile saved.");
    } catch (err: any) {
      notify("error", err?.response?.data?.message || "Couldn't save profile.");
    }
  };

  const savePassword = async () => {
    setStatus(null);
    try {
      await changeUserPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      notify("success", "Password changed.");
    } catch (err: any) {
      notify("error", err?.response?.data?.message || "Couldn't change password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("This permanently deletes your account. Continue?")) return;
    setIsDeleting(true);
    try {
      await removeAccount();
      await logout();
      navigate("/");
    } catch (err) {
      notify("error", "Couldn't delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 md:mx-0">
      <h1 className="font-display text-2xl font-semibold text-text">Settings</h1>

      {status && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            status.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Cover */}
        <div className="group relative h-40 w-full bg-gradient-to-br from-primary/20 via-surface to-accent/10">
          {coverPreview && (
            <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"
          >
            <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium">
              <ImagePlus size={14} />
              Change cover
            </span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPick}
            className="hidden"
          />

          {/* Avatar overlaps cover */}
          <div className="absolute -bottom-10 left-6 group/avatar">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="avatar"
                className="h-20 w-20 rounded-2xl border-4 border-surface object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface bg-primary text-2xl font-bold text-on-primary shadow-lg">
                <User size={28} />
              </div>
            )}
            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition hover:bg-primary-hover"
              aria-label="Change profile picture"
            >
              <Camera size={13} />
            </button>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePick}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4 px-6 pb-6 pt-14">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Username</label>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-primary">
                <span className="text-sm text-text-secondary">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="username"
                  className="w-full bg-transparent text-sm text-text outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-50"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>

      <ThemeController />

      {/* PASSWORD */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="mb-3 text-sm font-semibold text-text">Change Password</p>
        <div className="space-y-2">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min. 6 characters)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={savePassword}
          disabled={!currentPassword || newPassword.length < 6 || isSaving}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Update Password
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
        <p className="mb-1 text-sm font-semibold text-danger">Danger Zone</p>
        <p className="mb-3 text-xs text-text-secondary">
          Deleting your account permanently removes your profile, posts, and comments.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="flex items-center gap-2 rounded-lg border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:opacity-50"
        >
          <Trash2 size={14} />
          Delete account
        </button>
      </div>
    </div>
  );
};

export default Settings;
