import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { useFollow } from "../../hooks/useFollow";
import type { IConversation } from "../../types/Message";

const timeAgo = (date?: string): string => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ChatList = () => {
  const { user } = useAuth();
  const { getConversations, onReceiveMessage, getOrCreateConversation } = useChat();
  const { following, refreshFollowData } = useFollow();
  const { conversationId: activeConversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  const sortByRecent = (list: IConversation[]) =>
    [...list].sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

  useEffect(() => {
    getConversations()
      .then((data) => setConversations(sortByRecent(data)))
      .catch(console.error)
      .finally(() => setIsLoading(false));

    if (user?._id) refreshFollowData(user._id);
  }, [user?._id]);

  useEffect(() => {
    const unsubscribe = onReceiveMessage((msg) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === msg.conversationId);
        if (!exists) return prev;

        const updated = prev.map((c) =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
            : c
        );

        return sortByRecent(updated);
      });
    });

    return unsubscribe;
  }, [onReceiveMessage]);

  const getOtherParticipant = (conversation: IConversation) =>
    conversation.participants.find((p) => p._id !== user?._id);

  // People you follow who you don't already have an open conversation
  // with — shown as one-tap "start a chat" avatars.
  const startableFollowing = following.filter(
    (f) => !conversations.some((c) => getOtherParticipant(c)?._id === f._id)
  );

  const handleStartChat = async (recipientId: string) => {
    setStartingId(recipientId);
    try {
      const conversation = await getOrCreateConversation(recipientId);
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <MessageCircle size={18} className="text-primary" />
        <h1 className="font-display text-lg font-semibold text-text">Chats</h1>
      </div>

      {/* FOLLOWING — quick-start row */}
      {startableFollowing.length > 0 && (
        <div className="border-b border-border px-3 py-3">
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Start a conversation
          </p>
          <div className="flex gap-3 overflow-x-auto px-1 pb-1">
            {startableFollowing.map((f) => (
              <button
                key={f._id}
                onClick={() => handleStartChat(f._id)}
                disabled={startingId === f._id}
                className="flex w-14 shrink-0 flex-col items-center gap-1 disabled:opacity-50"
              >
                {f.profile_url ? (
                  <img
                    src={f.profile_url}
                    alt={f.username}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent transition hover:ring-primary/40"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-2 ring-transparent transition hover:ring-primary/40">
                    {getInitials(f.name)}
                  </div>
                )}
                <span className="w-full truncate text-center text-[11px] text-text-secondary">
                  {f.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EXISTING CONVERSATIONS */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <MessageCircle className="h-8 w-8 text-text-secondary/40" />
            <p className="text-sm text-text-secondary">
              {following.length === 0
                ? "Follow someone to start chatting."
                : "No conversations yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const isActive = conversation._id === activeConversationId;

              return (
                <Link
                  key={conversation._id}
                  to={`/chat/${conversation._id}`}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                    isActive ? "bg-primary/10" : "hover:bg-surface"
                  }`}
                >
                  {other?.profile_url ? (
                    <img
                      src={other.profile_url}
                      alt={other.username}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {getInitials(other?.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-text">{other?.name || "Unknown"}</p>
                      <span className="shrink-0 text-xs text-text-secondary">
                        {timeAgo(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-text-secondary">
                      {conversation.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
