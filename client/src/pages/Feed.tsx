// src/pages/Feed.tsx

import { useState } from "react";
import { FolderGit2, MessageSquare } from "lucide-react";
import PostContainer from "../components/features/PostContainer";
import PostContent from "../components/features/PostContent";
import TextPostContainer from "../components/features/TextPostContainer";
import CreateTextPost from "../components/features/CreateTextPost";

type FeedTab = "projects" | "posts";

const Feed = () => {
  const [tab, setTab] = useState<FeedTab>("projects");

  return (
    <div className="w-full md:max-w-2xl md:mx-auto">
      {/* FEATURED TAB BAR */}
      <div className="sticky top-0 z-10 flex border-b border-border bg-background/95 backdrop-blur-md md:rounded-t-2xl md:border md:border-b-0">
        <button
          onClick={() => setTab("projects")}
          className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition ${
            tab === "projects"
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text"
          }`}
        >
          <FolderGit2 size={16} />
          Projects
        </button>
        <button
          onClick={() => setTab("posts")}
          className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-medium transition ${
            tab === "posts"
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text"
          }`}
        >
          <MessageSquare size={16} />
          Posts
        </button>
      </div>

      {tab === "projects" ? (
        <>
          <div className="px-4 pt-4 md:px-0 md:pt-0">
            <PostContent />
          </div>
          <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
            <PostContainer />
          </div>
        </>
      ) : (
        <>
          <div className="px-4 pt-4 md:px-0 md:pt-0">
            <CreateTextPost />
          </div>
          <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
            <TextPostContainer />
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;