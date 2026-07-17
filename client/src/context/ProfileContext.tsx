import {
  createContext,
  useState,
  type ReactNode,
} from "react";

import {
  ProfileData,
  type IProfileResponse,
} from "../api/services/profile.service";

interface ProfileContextType {
  userProfile: IProfileResponse | null;
  isLoading: boolean;
  profileData: (username: string) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userProfile, setUserProfile] =
    useState<IProfileResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        profileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}