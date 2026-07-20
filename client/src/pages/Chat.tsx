import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";

// Skeleton two-pane layout: conversation list on the left, active thread
// on the right. Only mutual-follow users can be messaged (enforced server-side).
const Chat = () => {
  const {
    conversations,
    activeMessages,
    loadConversations,
    openConversation,
    sendMessage,
  } = useChat();

  const [draft, setDraft] = useState("");

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] border border-border rounded-2xl overflow-hidden">
      <aside className="w-72 shrink-0 border-r border-border overflow-y-auto">
        {conversations.map((c) => {
          const other = c.participants[0];
          return (
            <button
              key={c._id}
              onClick={() => openConversation(other._id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{other?.name}</p>
                <p className="truncate text-xs text-text-secondary">{c.lastMessage}</p>
              </div>
            </button>
          );
        })}
      </aside>

      <section className="flex flex-1 flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {activeMessages.map((m) => (
            <div key={m._id} className="rounded-lg bg-surface px-3 py-2 text-sm text-text w-fit max-w-[70%]">
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message…"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default Chat;
