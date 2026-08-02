// src/pages/Chat.tsx

import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import type { IMessage, IConversation } from "../context/ChatContext";

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const {
    joinConversation,
    leaveConversation,
    sendMessage,
    onReceiveMessage,
    getMessages,
    getConversationById,
  } = useChat();

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    setIsLoading(true);

    Promise.all([getConversationById(conversationId), getMessages(conversationId)])
      .then(([conversationData, messagesData]) => {
        setConversation(conversationData);
        setMessages(messagesData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    joinConversation(conversationId);

    const unsubscribe = onReceiveMessage((msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      leaveConversation(conversationId);
      unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;

    sendMessage(conversationId, trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const getSenderId = (senderId: IMessage["senderId"]) =>
    typeof senderId === "string" ? senderId : senderId._id;

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const otherParticipant = conversation?.participants.find((p) => p._id !== user?._id);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          to="/chat"
          className="rounded-full p-1.5 text-text-secondary transition hover:bg-surface hover:text-text md:hidden"
        >
          <ArrowLeft size={18} />
        </Link>

        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-surface animate-pulse" />
            <div className="h-4 w-32 rounded bg-surface animate-pulse" />
          </div>
        ) : otherParticipant ? (
          <Link to={`/profile/${otherParticipant.username}`} className="flex items-center gap-3">
            {otherParticipant.profile_url ? (
              <img
                src={otherParticipant.profile_url}
                alt={otherParticipant.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                {getInitials(otherParticipant.name)}
              </div>
            )}

            <div>
              <p className="font-medium text-text">{otherParticipant.name}</p>
              <p className="text-xs text-text-secondary">@{otherParticipant.username}</p>
            </div>
          </Link>
        ) : (
          <p className="text-sm text-text-secondary">Conversation</p>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <p className="text-center text-sm text-text-secondary">Loading...</p>
        ) : (
          messages.map((msg) => {
            const isMine = getSenderId(msg.senderId) === user?._id;

            return (
              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    isMine ? "bg-primary text-on-primary" : "bg-surface border border-border text-text"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 border-t border-border p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text outline-none focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition disabled:opacity-50 hover:bg-primary-hover"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
