import { createContext, useState, useCallback, type ReactNode } from "react";
import type { IBookmark } from "../types/Bookmark";
import { getBookmarks, toggleBookmark } from "../api/services/bookmark.service";

interface BookmarkContextType {
  bookmarks: IBookmark["projectId"][];
  isLoading: boolean;
  fetchBookmarks: () => Promise<void>;
  toggle: (projectId: string) => Promise<void>;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<IBookmark["projectId"][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getBookmarks();
      setBookmarks(res.projects || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggle = async (projectId: string) => {
    await toggleBookmark(projectId);
    await fetchBookmarks();
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, isLoading, fetchBookmarks, toggle }}>
      {children}
    </BookmarkContext.Provider>
  );
}
