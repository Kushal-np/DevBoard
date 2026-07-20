import { useState } from "react";
import ThemeController from "../components/features/ThemeController";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/axiosConfig";
import { PROFILE_ENDPOINTS } from "../api/endpoints";

// PROFILE_ENDPOINTS.EDIT / CHANGE_PASSWORD need to be added
// (see api/ENDPOINTS_PATCH.md) to match the new profile.controller routes.
const Settings = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  const saveProfile = async () => {
    try {
      await apiClient.patch(PROFILE_ENDPOINTS.EDIT, { name, bio });
      await refreshUser();
      setStatus("Profile saved.");
    } catch {
      setStatus("Couldn't save profile.");
    }
  };

  const savePassword = async () => {
    try {
      await apiClient.patch(PROFILE_ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setStatus("Password changed.");
    } catch {
      setStatus("Couldn't change password.");
    }
  };

  return (
    <div className="w-full mx-auto md:mx-0 space-y-4 px-0 md:px-0">
      <ThemeController />

      {status && <p className="text-xs text-text-secondary">{status}</p>}

      <div className="rounded-xl border border-border bg-background p-4">
        <p className="mb-3 text-sm font-semibold text-text">Edit Profile</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        />
        <button onClick={saveProfile} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background">
          Save
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background p-4">
        <p className="mb-3 text-sm font-semibold text-text">Change Password</p>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        />
        <button onClick={savePassword} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
