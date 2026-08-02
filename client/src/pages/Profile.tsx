import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mail,
  AtSign,
  Users,
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

type ContentTab = "projects" | "posts";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        <p className="text-sm text-text-secondary">Loading profile…</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        <p className="text-sm text-text-secondary">This user couldn't be found.</p>
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
      {/* Cover */}
      <div className="relative h-52 w-full overflow-hidden md:h-64 md:rounded-b-3xl">
        {userProfile.cover_url ? (
          <img src={userProfile.cover_url} className="h-full w-full object-cover" alt="cover" />
        ) : (
          <div className="relative h-full w-full bg-gradient-to-br from-primary via-primary/40 to-accent/30">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/10" />
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        {/* Identity card — floats up over the cover */}
        <section className="relative -mt-16 rounded-3xl bg-surface/95 p-6 shadow-xl ring-1 ring-border backdrop-blur md:-mt-20 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {userProfile.profile_url ? (
                <img
                  src={userProfile.profile_url}
                  alt={userProfile.username}
                  className="h-28 w-28 rounded-full border-4 border-surface object-cover shadow-lg md:h-32 md:w-32"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-surface bg-primary text-3xl font-bold text-white shadow-lg md:h-32 md:w-32">
                  {userProfile.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}

              <div className="min-w-0 pb-1">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{userProfile.name}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-text-secondary">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <AtSign size={14} />
                    {userProfile.username}
                  </span>
                  <span className="text-text-secondary/30">•</span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <Mail size={14} />
                    {userProfile.email}
                  </span>
                </div>
              </div>
            </div>

            {isMyProfile ? (
              <Link
                to="/settings"
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-medium text-background transition hover:bg-primary-hover"
              >
                <Edit3 size={16} />
                Edit Profile
              </Link>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={handleMessageClick}
                  disabled={isMessaging}
                  className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 font-medium text-text transition hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Message
                </button>

                <button
                  onClick={handleFollowClick}
                  disabled={isFollowLoading || !followListLoaded}
                  className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    currentlyFollowing
                      ? "border border-border bg-background text-text hover:border-danger/50 hover:text-danger"
                      : "bg-primary text-background hover:bg-primary-hover"
                  }`}
                >
                  {currentlyFollowing ? (
                    <>
                      <UserCheck size={16} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {userProfile.bio && (
            <p className="mt-5 max-w-2xl leading-relaxed text-text-secondary">{userProfile.bio}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <button
              onClick={() => setActiveList("followers")}
              className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm transition hover:bg-surface-hover"
            >
              <span className="font-bold text-text">{followerCount}</span>
              <span className="text-text-secondary">Followers</span>
            </button>
            <button
              onClick={() => setActiveList("following")}
              className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm transition hover:bg-surface-hover"
            >
              <span className="font-bold text-text">{followingCount}</span>
              <span className="text-text-secondary">Following</span>
            </button>
            <span className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm text-text-secondary">
              <MapPin size={13} className="text-accent" />
              Nepal
            </span>
          </div>
        </section>

        {/* Content */}
        <section className="mt-6 rounded-3xl border border-border bg-surface overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setContentTab("projects")}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition ${
                contentTab === "projects"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <FolderGit2 size={16} />
              Projects
              <span className="rounded-full bg-background px-1.5 text-xs">{userProjects.length}</span>
            </button>
            <button
              onClick={() => setContentTab("posts")}
              className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition ${
                contentTab === "posts"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              <MessageSquare size={16} />
              Posts
              <span className="rounded-full bg-background px-1.5 text-xs">{userPosts.length}</span>
            </button>
          </div>

          <div className="p-6">
            {isContentLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-background animate-pulse" />
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
                      className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                    >
                      <h3 className="text-base font-bold transition group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                        {project.description}
                      </p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-text-secondary">
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
                  <div key={post._id} className="rounded-2xl border border-border bg-background p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{post.text}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="" className="mt-3 max-h-72 w-full rounded-lg object-cover" />
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
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
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-secondary/50">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="max-h-[70vh] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 font-bold">
            <Sparkles size={15} className="text-primary" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary transition hover:bg-background hover:text-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(70vh-60px)] overflow-y-auto p-2">
          {loading ? (
            <p className="p-4 text-center text-sm text-text-secondary">Loading…</p>
          ) : users.length === 0 ? (
            <p className="p-4 text-center text-sm text-text-secondary">No {title.toLowerCase()} yet</p>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                onClick={() => onUserClick(u)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-background"
              >
                {u.profile_url ? (
                  <img src={u.profile_url} alt={u.username} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-background">
                    {u.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-text-secondary">@{u.username}</p>
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
