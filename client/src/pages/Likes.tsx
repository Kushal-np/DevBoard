import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Clock, FolderGit2, MessageSquare } from "lucide-react";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS } from "../api/endpoints";
import { getLikedTextPosts } from "../api/services/textPost.service";
import type { IPost } from "../types/Post";
import type { ITextPost } from "../types/TextPost";

type LikeTab = "projects" | "posts";

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

const Likes = () => {
  const [tab, setTab] = useState<LikeTab>("projects");

  const [projects, setProjects] = useState<IPost[]>([]);
  const [textPosts, setTextPosts] = useState<ITextPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiClient.get(POST_ENDPOINTS.GET_STARRED),
      getLikedTextPosts(),
    ])
      .then(([projectsRes, textRes]) => {
        setProjects(projectsRes.data.projects || []);
        setTextPosts(textRes.posts || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = tab === "projects" ? projects.length : textPosts.length;

  return (
    <div className="max-w-2xl mx-auto md:py-4">
      {/* PAGE HEADER */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md md:rounded-t-2xl md:border md:border-b-0 md:px-5">
        <Heart size={18} className="text-danger" />
        <h1 className="font-display text-lg font-semibold text-text">Liked Posts</h1>
        <span className="ml-auto rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
          {activeCount}
        </span>
      </div>

      {/* TABS — projects and text posts are kept in separate places, as
          liking a project and liking a text post are different actions
          against different resources on the backend. */}
      <div className="flex border-b border-border md:border-x">
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
          <span className="rounded-full bg-background px-1.5 text-xs text-text-secondary">
            {projects.length}
          </span>
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
          <span className="rounded-full bg-background px-1.5 text-xs text-text-secondary">
            {textPosts.length}
          </span>
        </button>
      </div>

      <div className="px-4 py-4 md:rounded-b-2xl md:border md:border-t-0 md:border-border md:px-5">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : tab === "projects" ? (
          projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderGit2 className="mb-3 h-8 w-8 text-text-secondary/40" />
              <p className="text-sm text-text-secondary">No liked projects yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((post) => {
                const avatarUrl = post.userId?.profile_url;
                const username = post.userId?.username ?? "unknown";
                const extraTechCount = post.techStack ? post.techStack.length - 4 : 0;

                return (
                  <div
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="group cursor-pointer rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div className="flex gap-4">
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="h-20 w-20 flex-shrink-0 rounded-xl bg-background object-cover"
                        />
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-semibold text-text group-hover:underline">
                            {post.title}
                          </h3>
                          <span
                            className={
                              post.status === "published"
                                ? "flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                                : "flex-shrink-0 rounded-full bg-background px-2 py-0.5 text-[11px] text-text-secondary"
                            }
                          >
                            {post.status}
                          </span>
                        </div>

                        <p className="mt-0.5 line-clamp-2 text-sm text-text-secondary">
                          {post.description}
                        </p>

                        {post.techStack && post.techStack.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {post.techStack.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                              >
                                {tech}
                              </span>
                            ))}
                            {extraTechCount > 0 ? (
                              <span className="rounded-full bg-background px-2 py-0.5 text-[11px] text-text-secondary">
                                +{extraTechCount}
                              </span>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={username} className="h-5 w-5 rounded-full object-cover" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-primary/20" />
                          )}
                          <span className="font-medium text-text">@{username}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : textPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="mb-3 h-8 w-8 text-text-secondary/40" />
            <p className="text-sm text-text-secondary">No liked posts yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {textPosts.map((post) => {
              const author = post.userId;
              const profileHref = author?.username ? `/profile/${author.username}` : null;

              return (
                <div key={post._id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-3">
                    {profileHref ? (
                      <Link to={profileHref}>
                        {author?.profile_url ? (
                          <img src={author.profile_url} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {getInitials(author?.name)}
                          </div>
                        )}
                      </Link>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {getInitials(author?.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-text">{author?.name || "anonymous"}</p>
                      <p className="flex items-center gap-1 text-xs text-text-secondary">
                        <Clock size={11} />
                        {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text">{post.text}</p>

                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="" className="mt-3 max-h-72 w-full rounded-lg object-cover" />
                  )}

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-danger">
                    <Heart size={13} fill="currentColor" />
                    {post.likeCount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Likes;
