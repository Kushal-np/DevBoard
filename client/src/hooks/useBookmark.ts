import { useContext } from "react";
import { BookmarkContext } from "../context/BookmarkContext";

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used inside BookmarkProvider");
  }
  return context;
}
