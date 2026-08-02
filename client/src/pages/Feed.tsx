// src/pages/Feed.tsx

import { useState } from "react";
import { FolderGit2, MessageSquare, Award } from "lucide-react";
import PostContainer from "../components/features/PostContainer";
import PostContent from "../components/features/PostContent";
import TextPostContainer from "../components/features/TextPostContainer";
import CreateTextPost from "../components/features/CreateTextPost";
import FeaturedTab from "../components/features/FeaturedTab";

type FeedTab = "projects" | "posts" | "featured";

const tabs: { id: FeedTab; label: string; icon: typeof FolderGit2 }[] = [
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "posts", label: "Posts", icon: MessageSquare },
  { id: "featured", label: "Featured", icon: Award },
];

const Feed = () => {
  const [tab, setTab] = useState<FeedTab>("projects");

  return (
    <div className="w-full md:max-w-2xl md:mx-auto">
      {/* Eyebrow — terminal-style prompt, visible once the layout has room to breathe */}


      {/* FEED TAB BAR — segmented control */}
      <div className="sticky top-0 z-10 bg-background/95 py-3 backdrop-blur-md md:static md:bg-transparent md:py-0 md:backdrop-blur-none">
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-surface p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <Icon size={16} strokeWidth={tab === id ? 2.25 : 1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "projects" && (
        <>
          <div className="px-4 pt-4 md:px-0 md:pt-6">
            <PostContent />
          </div>
          <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
            <PostContainer />
          </div>
        </>
      )}

      {tab === "posts" && (
        <>
          <div className="px-4 pt-4 md:px-0 md:pt-6">
            <CreateTextPost />
          </div>
          <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
            <TextPostContainer />
          </div>
        </>
      )}

      {tab === "featured" && (
        <div className="mt-2 border-t border-border/60 md:mt-6 md:rounded-2xl md:border md:border-border/60">
          <FeaturedTab />
        </div>
      )}
    </div>
  );
};

export default Feed;