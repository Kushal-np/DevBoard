import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useFeed must be used inside the FeedProvider"
    );
  }
  return context;
}