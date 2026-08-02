import { useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, Users, FolderGit2, Tag as TagIcon } from "lucide-react";
import { searchUsers, searchPosts, searchByTag } from "../api/services/search.service";

type Mode = "users" | "posts" | "tags";

const MODES: { value: Mode; label: string; icon: typeof Users }[] = [
  { value: "posts", label: "Posts", icon: FolderGit2 },
  { value: "users", label: "Users", icon: Users },
  { value: "tags", label: "Tags", icon: TagIcon },
];

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("posts");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      if (mode === "users") {
        const res = await searchUsers(query);
        setResults(res.users || []);
      } else if (mode === "posts") {
        const res = await searchPosts(query);
        setResults(res.projects || []);
      } else {
        const res = await searchByTag(query);
        setResults(res.projects || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 font-display text-2xl font-semibold text-text">Search</h1>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-2 focus-within:border-primary/50">
        <SearchIcon size={18} className="ml-2 shrink-0 text-text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder={
            mode === "tags" ? "Search by tag, e.g. React..." : `Search ${mode}...`
          }
          className="flex-1 bg-transparent px-1 py-2 text-sm text-text outline-none placeholder:text-text-secondary"
        />
        <button
          onClick={runSearch}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-primary-hover"
        >
          Search
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                mode === m.value
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-text-secondary hover:bg-surface-hover"
              }`}
            >
              <Icon size={13} />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-surface animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <p className="py-10 text-center text-sm text-text-secondary">
            No results for "{query}".
          </p>
        )}

        {!isLoading && !hasSearched && (
          <p className="py-10 text-center text-sm text-text-secondary">
            Search for developers, projects, or tags to get started.
          </p>
        )}

        {!isLoading &&
          results.map((r) =>
            mode === "users" ? (
              <Link
                key={r._id}
                to={`/profile/${r.username}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40"
              >
                {r.profile_url ? (
                  <img src={r.profile_url} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {getInitials(r.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{r.name}</p>
                  <p className="truncate text-sm text-text-secondary">@{r.username}</p>
                </div>
              </Link>
            ) : (
              <Link
                key={r._id}
                to={`/post/${r._id}`}
                className="block rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40"
              >
                <p className="font-medium text-text">{r.title}</p>
                <p className="line-clamp-2 text-sm text-text-secondary">{r.description}</p>
              </Link>
            )
          )}
      </div>
    </div>
  );
};

export default Search;
