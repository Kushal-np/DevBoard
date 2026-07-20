import { useEffect } from "react";
import { useBookmark } from "../hooks/useBookmark";
import PostContainer from "../components/features/PostContainer";

// Reuses PostContainer's card UI by just feeding it bookmarked posts.
// Simplest skeleton: render title/description list; swap in PostContainer's
// card markup once you're happy with the data flow.
const Bookmarks = () => {
  const { bookmarks, isLoading, fetchBookmarks } = useBookmark();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  if (isLoading) {
    return <p className="p-6 text-sm text-text-secondary">Loading bookmarks…</p>;
  }

  if (bookmarks.length === 0) {
    return <p className="p-6 text-sm text-text-secondary">No bookmarks yet.</p>;
  }

  return (
    <div className="divide-y divide-border/60">
      {bookmarks.map((post: any) => (
        <div key={post._id} className="px-4 py-4">
          <p className="font-medium text-text">{post.title}</p>
          <p className="text-sm text-text-secondary line-clamp-2">{post.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Bookmarks;
