// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mail,
  AtSign,
  UserPlus,
  UserCheck,
  MapPin,
  Edit3,
  X,
  Heart,
  Clock,
  FolderGit2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import type { FollowUser } from "../types/follow";
import { useFollow } from "../hooks/useFollow";
import { useChat } from "../hooks/useChat";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS } from "../api/endpoints";
import { getPostsByUser } from "../api/services/textPost.service";
import type { ITextPost } from "../types/TextPost";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

type ContentTab = "projects" | "posts";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userProfile, isLoading, profileData } = useProfile();
  const { getOrCreateConversation } = useChat();

  const {
    following,
    followers,
    followerCount,
    followingCount,
    follow,
    unfollow,
    refreshFollowData,
    setFollowers,
    isLoading: isFollowLoading,
  } = useFollow();

  const [activeList, setActiveList] = useState<"followers" | "following" | null>(null);
  const [followListLoaded, setFollowListLoaded] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  const [contentTab, setContentTab] = useState<ContentTab>("projects");
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<ITextPost[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    if (username) {
      profileData(username);
    }
  }, [username]);

  useEffect(() => {
    if (userProfile?._id) {
      setFollowListLoaded(false);
      refreshFollowData(userProfile._id).finally(() => setFollowListLoaded(true));

      setIsContentLoading(true);
      Promise.all([
        apiClient.get(POST_ENDPOINTS.GET_BY_USER(userProfile._id)),
        getPostsByUser(userProfile._id),
      ])
        .then(([projectsRes, postsRes]) => {
          setUserProjects(projectsRes.data?.projects ?? []);
          setUserPosts(postsRes.posts ?? []);
        })
        .catch(console.error)
        .finally(() => setIsContentLoading(false));
    }
  }, [userProfile?._id, refreshFollowData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-5xl px-4">
          <div className="h-52 animate-pulse rounded-xl bg-surface md:h-64" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background text-center">
        <p className="font-display text-lg text-text">This user couldn't be found</p>
        <p className="text-sm text-text-secondary">Check the username, or they may have moved on.</p>
      </div>
    );
  }

  const isMyProfile = !!user && user._id === userProfile._id;
  const currentlyFollowing = !!user && followers.some((f) => String(f._id) === String(user._id));

  const handleFollowClick = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    const me: FollowUser = {
      _id: user._id,
      username: user.username,
      name: user.name,
      profile_url: user.profile_url,
    };

    if (currentlyFollowing) {
      setFollowers((prev) => prev.filter((f) => String(f._id) !== String(user._id)));
      try {
        await unfollow(userProfile._id);
      } catch {
        setFollowers((prev) => [...prev, me]);
      }
    } else {
      setFollowers((prev) => [...prev, me]);
      try {
        await follow(userProfile._id);
      } catch {
        setFollowers((prev) => prev.filter((f) => String(f._id) !== String(user._id)));
      }
    }

    profileData(userProfile.username);
    refreshFollowData(userProfile._id);
  };

  const handleUserClick = (u: FollowUser) => {
    setActiveList(null);
    if (u.username) {
      navigate(`/profile/${u.username}`);
    }
  };

  const handleMessageClick = async () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    if (isMessaging) return;

    setIsMessaging(true);
    try {
      const conversation = await getOrCreateConversation(userProfile._id);
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Cover — same dot-grid device used in the hero, reserved for this
          one high-impact moment on the page rather than repeated below. */}
      <div className="relative h-52 w-full overflow-hidden md:h-64 md:rounded-b-2xl">
        {userProfile.cover_url ? (
          <img src={userProfile.cover_url} className="h-full w-full object-cover" alt="cover" />
        ) : (
          <div className="relative h-full w-full bg-gradient-to-br from-primary/25 via-surface to-accent/10">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                maskImage: "radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 90% 100% at 50% 0%, black 30%, transparent 100%)",
              }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        {/* Identity card — floats up over the cover */}
        <section className="relative -mt-16 rounded-xl border border-border bg-surface/95 p-6 backdrop-blur md:-mt-20 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {userProfile.profile_url ? (
                <img
                  src={userProfile.profile_url}
                  alt={userProfile.username}
                  className="h-28 w-28 rounded-full border-4 border-surface object-cover md:h-32 md:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-surface bg-primary/10 font-display text-3xl font-semibold text-primary md:h-32 md:w-32">
                  {userProfile.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}

              <div className="min-w-0 pb-1">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-text md:text-3xl">
                  {userProfile.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-text-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <AtSign size={13} />
                    {userProfile.username}
                  </span>
                  <span className="text-text-secondary/40">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {userProfile.email}
                  </span>
                </div>
              </div>
            </div>

            {isMyProfile ? (
              <Link to="/settings" className="shrink-0">
                <Button size="sm" variant="secondary">
                  <Edit3 size={15} />
                  Edit profile
                </Button>
              </Link>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <Button size="sm" variant="secondary" onClick={handleMessageClick} disabled={isMessaging}>
                  Message
                </Button>

                <Button
                  size="sm"
                  variant={currentlyFollowing ? "secondary" : "primary"}
                  onClick={handleFollowClick}
                  disabled={isFollowLoading || !followListLoaded}
                  className={currentlyFollowing ? "hover:border-danger/50 hover:text-danger" : ""}
                >
                  {currentlyFollowing ? (
                    <>
                      <UserCheck size={15} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {userProfile.bio && (
            <p className="mt-5 max-w-2xl leading-relaxed text-text-secondary">{userProfile.bio}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <button
              onClick={() => setActiveList("followers")}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="font-mono font-medium text-text">{followerCount}</span>
              <span className="text-text-secondary">Followers</span>
            </button>
            <button
              onClick={() => setActiveList("following")}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="font-mono font-medium text-text">{followingCount}</span>
              <span className="text-text-secondary">Following</span>
            </button>
            <Badge tone="accent">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} />
                Nepal
              </span>
            </Badge>
          </div>
        </section>

        {/* Content */}
        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex border-b border-border">
            <button
              onClick={() => setContentTab("projects")}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-colors duration-150 ${
                contentTab === "projects"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <FolderGit2 size={16} />
              Projects
              <span className="rounded-full bg-background px-1.5 font-mono text-xs">{userProjects.length}</span>
            </button>
            <button
              onClick={() => setContentTab("posts")}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-colors duration-150 ${
                contentTab === "posts"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <MessageSquare size={16} />
              Posts
              <span className="rounded-full bg-background px-1.5 font-mono text-xs">{userPosts.length}</span>
            </button>
          </div>

          <div className="p-6">
            {isContentLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-background" />
                ))}
              </div>
            ) : contentTab === "projects" ? (
              userProjects.length === 0 ? (
                <EmptyState icon={<FolderGit2 size={22} />} text="No published projects yet." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {userProjects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/post/${project._id}`}
                      className="group rounded-xl border border-border bg-background p-5 transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/30"
                    >
                      <h3 className="font-display text-base font-medium text-text transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{project.description}</p>
                      <div className="mt-4 flex items-center gap-3 font-mono text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Heart size={12} />
                          {project.starCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {timeAgo(project.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            ) : userPosts.length === 0 ? (
              <EmptyState icon={<MessageSquare size={22} />} text="No posts yet." />
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post._id} className="rounded-xl border border-border bg-background p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{post.text}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="" className="mt-3 max-h-72 w-full rounded-lg object-cover" />
                    )}
                    <div className="mt-3 flex items-center gap-3 font-mono text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Heart size={12} />
                        {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {timeAgo(post.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {activeList && (
        <FollowListModal
          title={activeList === "followers" ? "Followers" : "Following"}
          users={activeList === "followers" ? followers : following}
          loading={isFollowLoading}
          onClose={() => setActiveList(null)}
          onUserClick={handleUserClick}
        />
      )}
    </div>
  );
};

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text-secondary">
        {icon}
      </div>
      <p className="text-sm text-text-secondary">{text}</p>
    </div>
  );
}

function FollowListModal({
  title,
  users,
  loading,
  onClose,
  onUserClick,
}: {
  title: string;
  users: FollowUser[];
  loading: boolean;
  onClose: () => void;
  onUserClick: (u: FollowUser) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4" onClick={onClose}>
      <div
        className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-text">
            <Sparkles size={15} className="text-primary" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition-colors duration-150 hover:bg-background hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(70vh-60px)] overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-background" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="p-4 text-center text-sm text-text-secondary">No {title.toLowerCase()} yet</p>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                onClick={() => onUserClick(u)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-background"
              >
                {u.profile_url ? (
                  <img src={u.profile_url} alt={u.username} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-medium text-primary">
                    {getInitials(u.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{u.name}</p>
                  <p className="truncate font-mono text-xs text-text-secondary">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;