// src/components/layout/TrendBar.tsx

import { 
  Users, 
  TrendingUp, 
  Hash,
  ArrowUpRight,
  Flame,
  Clock,
  UserPlus,
  Zap,
  Award,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// Dummy data
const recommendedUsers = [
  { id: 1, name: "Gaurish Baliga", username: "@gaurishcodes", avatar: "", bio: "Building the future" },
  { id: 2, name: "Prabin KC", username: "@KcPrabin18", avatar: "", bio: "Fullstack Dev" },
  { id: 3, name: "Yash Kalwani", username: "@WHYKalwani", avatar: "", bio: "UI/UX Designer" },
  { id: 4, name: "Aarav Mehta", username: "@aaravdev", avatar: "", bio: "Open Source" },
  { id: 5, name: "Priya Sharma", username: "@priyacodes", avatar: "", bio: "ML Engineer" },
];

const trendingTopics = [
  { id: 1, name: "#BuildinPublic", posts: "12.8K" },
  { id: 2, name: "#GrindNation", posts: "6.7K" },
  { id: 3, name: "#AI", posts: "6.2K" },
  { id: 4, name: "#WebDev", posts: "5.1K" },
  { id: 5, name: "#StartupLife", posts: "3.8K" },
];

const trendingPosts = [
  { id: 1, title: "How I built a SaaS in 30 days", author: "@kush", likes: 489, time: "2h ago" },
  { id: 2, title: "The future of AI in 2026", author: "@sharapova", likes: 241, time: "6h ago" },
  { id: 3, title: "From zero to first 100 users", author: "@kush", likes: 193, time: "6h ago" },
  { id: 4, title: "My open source journey", author: "@devansh", likes: 156, time: "8h ago" },
];

const TrendBar = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="hidden lg:block lg:w-[340px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-6 lg:px-3 space-y-4 scrollbar-thin scrollbar-thumb-border/30 scrollbar-track-transparent">
      {/* Welcome Card */}
      <div className="rounded-2xl bg-surface/40 backdrop-blur-sm border border-border/30 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text">
              Welcome back, {user?.username || 'Developer'}!
            </p>
            <p className="text-xs text-text-secondary/60">Discover what's trending</p>
          </div>
        </div>
      </div>

      {/* Who to Follow */}
      <div className="rounded-2xl border border-border/30 bg-surface/40 backdrop-blur-sm p-4 transition-colors hover:border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Users size={16} className="text-primary" />
            Who to Follow
          </h3>
          <button className="text-xs text-primary hover:text-primary-hover transition flex items-center gap-1">
            See All
            <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {recommendedUsers.slice(0, 4).map((user) => (
            <div key={user.id} className="flex items-center gap-3 group">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-border/20"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-medium text-primary ring-2 ring-border/20">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{user.name}</p>
                <p className="text-xs text-text-secondary/60 truncate">{user.username}</p>
              </div>
              <button className="rounded-full border border-primary/20 px-3 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-background hover:border-primary">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="rounded-2xl border border-border/30 bg-surface/40 backdrop-blur-sm p-4 transition-colors hover:border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Trending
          </h3>
          <button className="text-xs text-primary hover:text-primary-hover transition flex items-center gap-1">
            See All
            <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {trendingTopics.slice(0, 4).map((topic) => (
            <div 
              key={topic.id} 
              className="flex items-center justify-between group cursor-pointer rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-text-secondary/30" />
                <span className="text-sm text-text transition-colors group-hover:text-primary">
                  {topic.name}
                </span>
              </div>
              <span className="text-xs text-text-secondary/40">{topic.posts} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Posts */}
      <div className="rounded-2xl border border-border/30 bg-surface/40 backdrop-blur-sm p-4 transition-colors hover:border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            Popular Now
          </h3>
          <button className="text-xs text-primary hover:text-primary-hover transition flex items-center gap-1">
            See All
            <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {trendingPosts.slice(0, 3).map((post) => (
            <div 
              key={post.id} 
              className="group cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-surface-hover"
            >
              <p className="text-sm text-text font-medium transition-colors group-hover:text-primary line-clamp-2">
                {post.title}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary/40">
                <span className="flex items-center gap-1">
                  <UserPlus size={12} />
                  {post.author}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.time}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  ❤️ {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Get Certified */}
      <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-4 transition-colors hover:border-primary/20">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 shrink-0">
            <Award size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-text">Earn a Job-Ready Certificate</h4>
            <p className="text-xs text-text-secondary/60 mt-0.5">Explore diverse skills, and education.</p>
            <button className="mt-2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-background transition-colors hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-border/10">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-text-secondary/30">
          <a href="#" className="transition-colors hover:text-text-secondary/60">Terms</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Privacy</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Cookies</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Accessibility</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">Ads Info</a>
          <a href="#" className="transition-colors hover:text-text-secondary/60">More</a>
        </div>
        <p className="text-[10px] text-text-secondary/20 mt-2">© 2026 BuildHub. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default TrendBar;