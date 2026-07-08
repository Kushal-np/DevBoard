// LandingPage.tsx — Refined minimal developer community (fully theme-aware)
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Heart,
  Search,
  Command,
  GitBranch,
  Star,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

/* ---------------------------------------------------------------------------
   Data
--------------------------------------------------------------------------- */
const communityData = {
  members: "12,847",
  online: "2,341",
  posts: "8,243",
  projects: "1,243",
  growth: "+23%",
};

const trendingTags = ["typescript", "rust", "distributed-systems", "webgpu", "llm-tooling"];

const featuredPosts = [
  {
    id: 1,
    title: "Building resilient microservices with Go",
    excerpt:
      "A practical guide to designing fault-tolerant systems with proper error handling and retry mechanisms.",
    author: "Alex Rivera",
    role: "Senior Engineer @ Stripe",
    date: "2 hours ago",
    tags: ["Go", "Architecture"],
    likes: 342,
    comments: 89,
    readTime: "5 min",
  },
  {
    id: 2,
    title: "The evolution of frontend architecture",
    excerpt:
      "From jQuery to modern component-based systems — understanding the patterns that shaped the web.",
    author: "Sarah Chen",
    role: "Frontend Lead @ Vercel",
    date: "4 hours ago",
    tags: ["React", "Design"],
    likes: 567,
    comments: 123,
    readTime: "4 min",
  },
  {
    id: 3,
    title: "Mastering type systems in TypeScript",
    excerpt:
      "Advanced patterns for type-safe applications using conditional types, mapped types, and inference.",
    author: "James Park",
    role: "TypeScript Expert",
    date: "6 hours ago",
    tags: ["TypeScript", "Patterns"],
    likes: 234,
    comments: 67,
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Serverless architecture patterns",
    excerpt:
      "Building scalable applications without infrastructure management using event-driven design.",
    author: "Maya Patel",
    role: "Cloud Architect @ AWS",
    date: "8 hours ago",
    tags: ["AWS", "Serverless"],
    likes: 421,
    comments: 94,
    readTime: "7 min",
  },
];

const upcomingEvents = [
  { title: "Open Source Summit 2026", date: "Jul 25", attendees: "847", type: "Summit" },
  { title: "Cloud Native Workshop", date: "Aug 2", attendees: "523", type: "Workshop" },
  { title: "Tech Career Fair", date: "Aug 15", attendees: "1.2k", type: "Fair" },
];

const topContributors = [
  { name: "Elena V.", role: "Core Team", contributions: "247" },
  { name: "Marcus T.", role: "Moderator", contributions: "189" },
  { name: "Priya K.", role: "Core Team", contributions: "156" },
  { name: "David O.", role: "Contributor", contributions: "134" },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------------------
   Small shared primitives
--------------------------------------------------------------------------- */
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-mono">{children}</p>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10px] font-mono tracking-wider text-secondary border border-border px-2.5 py-0.5 rounded-full">
    {children}
  </span>
);

/* ---------------------------------------------------------------------------
   Hero
--------------------------------------------------------------------------- */
const HeroPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      className="space-y-10 max-w-3xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut }}
    >
      {/* Status line */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-secondary font-mono text-xs tracking-wider">LIVE</span>
        </div>
        <span className="w-px h-4 bg-border" />
        <span className="text-secondary text-sm">{communityData.online} online now</span>
        <span className="w-px h-4 bg-border" />
        <span className="flex items-center gap-1.5 text-secondary text-sm">
          <TrendingUp className="w-3.5 h-3.5 text-success" />
          {communityData.growth} this week
        </span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.02]">
          <span className="text-text">Developer</span>
          <br />
          <span className="font-medium bg-gradient-to-br from-text to-text/55 bg-clip-text text-transparent">
            Community
          </span>
        </h1>
        <div className="mt-6 flex items-center gap-3">
          <p className="text-textSecondary text-lg leading-relaxed max-w-lg">
            A curated space for engineers to share knowledge, build together, and grow.
          </p>
          <Pill>BETA</Pill>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
        <input
          type="text"
          placeholder="Search discussions, projects, people…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-16 py-3.5 bg-primary/[0.03] border border-border rounded-xl focus:outline-none focus-visible:border-primary/25 focus-visible:bg-primary/[0.05] text-text placeholder-secondary text-sm transition-all duration-300"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-secondary font-mono border border-border rounded-md px-1.5 py-0.5">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      {/* Trending tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-secondary uppercase tracking-widest mr-1">Trending</span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            className="text-[11px] font-mono text-textSecondary hover:text-text border border-border hover:border-primary/25 px-2.5 py-1 rounded-full transition-colors duration-200"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-10 sm:gap-12 pt-2">
        {[
          { v: communityData.members, l: "Members" },
          { v: communityData.posts, l: "Discussions" },
          { v: communityData.projects, l: "Projects" },
        ].map((s, i) => (
          <div key={s.l} className="flex items-center gap-10 sm:gap-12">
            {i > 0 && <span className="w-px h-10 bg-border" />}
            <div>
              <p className="text-3xl font-light text-text tracking-tight">{s.v}</p>
              <p className="text-[11px] text-secondary uppercase tracking-widest mt-1">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4 pt-2">
        <motion.button
          className="px-7 py-3.5 bg-primary text-background rounded-xl font-medium text-sm hover:bg-primaryHover transition-colors duration-300 shadow-lg shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Join community
        </motion.button>
        <motion.button
          className="px-7 py-3.5 border border-border rounded-xl text-sm text-textSecondary hover:text-text hover:border-primary/25 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Explore
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------------------
   Stat card
--------------------------------------------------------------------------- */
const StatCard: React.FC<{
  value: string;
  label: string;
  description: string;
  delay: number;
}> = ({ value, label, description, delay }) => (
  <motion.div
    className="border border-border rounded-xl px-6 py-5 bg-primary/[0.02] hover:bg-primary/[0.04] hover:border-primary/15 transition-all duration-300 group"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay }}
  >
    <p className="text-3xl font-light text-text tracking-tight">{value}</p>
    <p className="text-[10px] text-secondary uppercase tracking-widest mt-2">{label}</p>
    <p className="text-[10px] text-secondary/70 mt-0.5">{description}</p>
  </motion.div>
);

/* ---------------------------------------------------------------------------
   Post card
--------------------------------------------------------------------------- */
const PostCard: React.FC<{ post: (typeof featuredPosts)[0]; index: number }> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      className="group py-7 first:pt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-start gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-text font-medium">{post.author}</span>
            <span className="text-secondary/60">•</span>
            <span className="text-secondary text-xs">{post.role}</span>
            <span className="ml-auto flex items-center gap-2 text-[10px] text-secondary font-mono">
              {post.readTime}
              <span className="text-secondary/50">•</span>
              {post.date}
            </span>
          </div>

          <a href="#" className="block mt-2">
            <h3 className="text-lg font-medium text-text group-hover:text-textSecondary transition-colors duration-300 leading-snug">
              {post.title}
            </h3>
            <p className="text-textSecondary text-sm mt-1.5 leading-relaxed max-w-xl">
              {post.excerpt}
            </p>
          </a>

          <div className="flex flex-wrap items-center gap-4 mt-3.5">
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-secondary border border-border px-2.5 py-0.5 rounded-full font-mono tracking-wide"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-5 ml-auto text-xs text-secondary">
              <button className="flex items-center gap-1.5 hover:text-text transition-colors duration-200 group/like">
                <Heart className="w-3.5 h-3.5 group-hover/like:fill-current transition-all" />
                <span className="font-mono text-[11px]">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-text transition-colors duration-200">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">{post.comments}</span>
              </button>
            </div>
          </div>
        </div>
        <ArrowUpRight
          className={`w-4 h-4 flex-shrink-0 mt-1 transition-all duration-300 ${
            isHovered
              ? "text-text opacity-100 translate-x-0.5 -translate-y-0.5"
              : "text-secondary opacity-0"
          }`}
        />
      </div>
    </motion.article>
  );
};

/* ---------------------------------------------------------------------------
   Event card
--------------------------------------------------------------------------- */
const EventCard: React.FC<{ event: (typeof upcomingEvents)[0]; index: number }> = ({
  event,
  index,
}) => (
  <motion.div
    className="border border-border rounded-xl p-4 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300 cursor-default group"
    whileHover={{ x: 3 }}
    initial={{ opacity: 0, x: -5 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-text font-medium group-hover:text-textSecondary transition-colors">
          {event.title}
        </p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-xs text-secondary font-mono">{event.date}</span>
          <span className="w-px h-3 bg-border" />
          <span className="text-xs text-secondary flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {event.attendees} attending
          </span>
        </div>
      </div>
      <Pill>{event.type}</Pill>
    </div>
  </motion.div>
);

/* ---------------------------------------------------------------------------
   Page
--------------------------------------------------------------------------- */
const LandingPage: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Popular", "Recent", "Top"];

  return (
    <div className="min-h-screen bg-background text-text selection:bg-primary/10">
      {/* Ambient background — theme-aware */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-primary/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 35%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 35%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-7">
            <HeroPanel />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-10">
            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Eyebrow>Upcoming events</Eyebrow>
                <button className="text-[10px] text-secondary hover:text-text transition-colors">
                  View all →
                </button>
              </div>
              <div className="space-y-2">
                {upcomingEvents.map((event, i) => (
                  <EventCard key={i} event={event} index={i} />
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div>
              <div className="mb-4">
                <Eyebrow>Top contributors</Eyebrow>
              </div>
              <div className="space-y-2.5">
                {topContributors.map((contributor, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between border border-border rounded-lg px-4 py-2.5 hover:border-primary/15 hover:bg-primary/[0.02] transition-all"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-secondary font-mono w-4">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-sm text-text font-medium">{contributor.name}</p>
                        <p className="text-[10px] text-secondary">{contributor.role}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-textSecondary">
                      {contributor.contributions}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div>
              <div className="mb-3">
                <Eyebrow>Quick stats</Eyebrow>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-border rounded-lg p-3.5 hover:border-primary/15 transition-colors">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-secondary" />
                    <p className="text-sm font-light text-text">243</p>
                  </div>
                  <p className="text-[10px] text-secondary mt-1">Active repos</p>
                </div>
                <div className="border border-border rounded-lg p-3.5 hover:border-primary/15 transition-colors">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-secondary" />
                    <p className="text-sm font-light text-text">1.2k</p>
                  </div>
                  <p className="text-[10px] text-secondary mt-1">Stars earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-24">
          <StatCard value="12,847" label="Members" description="Active developers" delay={0.05} />
          <StatCard value="2,341" label="Online" description="Right now" delay={0.1} />
          <StatCard value="8,243" label="Posts" description="Community discussions" delay={0.15} />
          <StatCard value="1,243" label="Projects" description="Open source" delay={0.2} />
        </div>

        {/* Featured posts */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-light text-text tracking-tight">Featured</h2>
              <p className="text-sm text-secondary mt-0.5">Latest from the community</p>
            </div>
            <div className="flex gap-1 border border-border rounded-lg p-0.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 text-[11px] rounded-md transition-all duration-200 ${
                    filter === f
                      ? "bg-primary/10 text-text"
                      : "text-secondary hover:text-text"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {featuredPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>

          <button className="w-full mt-8 py-4 border border-border rounded-xl text-sm text-secondary hover:text-text hover:border-primary/20 transition-all duration-300">
            View all discussions →
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-24 border border-border rounded-2xl p-12 text-center bg-primary/[0.02] hover:bg-primary/[0.03] transition-colors overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
          <h3 className="text-3xl font-light text-text">Join the community</h3>
          <p className="text-textSecondary text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Connect with thousands of developers building the future of technology.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button className="px-7 py-3 bg-primary text-background rounded-xl text-sm font-medium hover:bg-primaryHover transition-colors duration-300 shadow-lg shadow-primary/10">
              Get started
            </button>
            <button className="px-7 py-3 border border-border rounded-xl text-sm text-textSecondary hover:text-text hover:border-primary/25 transition-colors duration-300">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;