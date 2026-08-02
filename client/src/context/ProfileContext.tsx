import { createContext, useState, type ReactNode } from "react";

import {
  ProfileData,
  editProfile,
  editProfileWithImages,
  changePassword,
  deleteAccount,
  type IProfileResponse,
  type EditProfilePayload,
  type ChangePasswordPayload,
} from "../api/services/profile.service";

interface ProfileContextType {
  userProfile: IProfileResponse | null;
  isLoading: boolean;
  isSaving: boolean;
  profileData: (username: string) => Promise<void>;
  updateProfile: (payload: EditProfilePayload) => Promise<IProfileResponse | null>;
  updateProfileWithImages: (formData: FormData) => Promise<IProfileResponse | null>;
  changeUserPassword: (payload: ChangePasswordPayload) => Promise<void>;
  removeAccount: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<IProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function profileData(username: string) {
    setIsLoading(true);

    try {
      const response = await ProfileData(username);

      if (response.success) {
        setUserProfile(response.user);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error(error);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile(payload: EditProfilePayload) {
    setIsSaving(true);
    try {
      const res = await editProfile(payload);
      if (res.success) setUserProfile(res.user);
      return res.user;
    } finally {
      setIsSaving(false);
    }
  }

  async function updateProfileWithImages(formData: FormData) {
    setIsSaving(true);
    try {
      const res = await editProfileWithImages(formData);
      if (res.success) setUserProfile(res.user);
      return res.user;
    } finally {
      setIsSaving(false);
    }
  }

  async function changeUserPassword(payload: ChangePasswordPayload) {
    setIsSaving(true);
    try {
      await changePassword(payload);
    } finally {
      setIsSaving(false);
    }
  }

  async function removeAccount() {
    await deleteAccount();
  }

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        isSaving,
        profileData,
        updateProfile,
        updateProfileWithImages,
        changeUserPassword,
        removeAccount,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
