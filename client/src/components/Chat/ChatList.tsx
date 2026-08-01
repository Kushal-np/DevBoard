
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
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
  const { getConversations, onReceiveMessage } = useChat();
  const { conversationId: activeConversationId } = useParams<{ conversationId?: string }>();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

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

  if (isLoading) {
    return (
      <div className="p-3 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-surface animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-text-secondary">No conversations yet.</p>
      </div>
    );
  }

  return (
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
                <p className="truncate font-medium text-text">
                  {other?.name || "Unknown"}
                </p>
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
  );
};

export default ChatList;