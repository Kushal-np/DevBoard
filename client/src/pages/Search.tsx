import { useState } from "react";
import { searchUsers, searchPosts, searchByTag } from "../api/services/search.service";

type Mode = "users" | "posts" | "tags";

// Skeleton search page: one input, one mode switch, results rendered
// as plain rows. Add this route in AppRoutes.tsx: <Route path="/search" element={<Search />} />
const Search = () => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("posts");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
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
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder="Search…"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none"
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text"
        >
          <option value="posts">Posts</option>
          <option value="users">Users</option>
          <option value="tags">Tags</option>
        </select>
        <button onClick={runSearch} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background">
          Search
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-text-secondary">Searching…</p>}
        {!isLoading && results.length === 0 && <p className="text-sm text-text-secondary">No results yet.</p>}
        {results.map((r) => (
          <div key={r._id} className="rounded-lg border border-border p-3">
            <p className="font-medium text-text">{r.title || r.name}</p>
            <p className="text-sm text-text-secondary">{r.description || r.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
