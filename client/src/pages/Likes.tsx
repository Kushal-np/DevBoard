import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart,Clock } from "lucide-react";
import apiClient from "../api/axiosConfig";
import { POST_ENDPOINTS } from "../api/endpoints";
import type { IPost } from "../types/Post";

const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Likes = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(POST_ENDPOINTS.GET_STARRED)
      .then((res) => setPosts(res.data.projects || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="w-8 h-8 text-gray-300 mb-3" />
        <p className="text-sm text-gray-400">No liked posts yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-3">
      {posts.map((post) => {
        const avatarUrl = post.userId?.profile_url;
        const username = post.userId?.username ?? "unknown";
        const extraTechCount = post.techStack ? post.techStack.length - 4 : 0;

        return (
          <div
            key={post._id}
            onClick={() => navigate(`/post/${post._id}`)}
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex gap-4">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-50"
                />
              ) : null}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:underline">
                    {post.title}
                  </h3>
                  <span
                    className={
                      post.status === "published"
                        ? "text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 bg-green-50 text-green-600"
                        : "text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 bg-gray-100 text-gray-500"
                    }
                  >
                    {post.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                  {post.description}
                </p>

                {post.techStack && post.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {extraTechCount > 0 ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                        +{extraTechCount}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={username}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-200" />
                    )}
                    <span className="text-gray-600 font-medium">@{username}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Likes;