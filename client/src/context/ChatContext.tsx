import { createContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { getConversations, startConversation, getMessages } from "../api/services/chat.service";
import { useAuth } from "../hooks/useAuth";
import type { IConversation, IMessage } from "../types/Message";

interface ChatContextType {
  conversations: IConversation[];
  activeMessages: IMessage[];
  activeConversationId: string | null;
  isLoading: boolean;
  loadConversations: () => Promise<void>;
  openConversation: (userId: string) => Promise<void>;
  sendMessage: (text: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Skeleton: connects to the socket server once authenticated, joins the
// active conversation room, and appends incoming messages live.
export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeMessages, setActiveMessages] = useState<IMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = io("http://localhost:8000", { withCredentials: true });
    socketRef.current = socket;

    socket.on("receive-message", (message: IMessage) => {
      setActiveMessages((prev) =>
        message.conversationId === activeConversationId ? [...prev, message] : prev
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getConversations();
      setConversations(res.conversations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openConversation = async (userId: string) => {
    try {
      setIsLoading(true);
      const res = await startConversation(userId);
      const conversationId = res.conversation._id;

      socketRef.current?.emit("join-conversation", conversationId);
      setActiveConversationId(conversationId);

      const msgRes = await getMessages(conversationId);
      setActiveMessages(msgRes.messages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (text: string) => {
    if (!activeConversationId || !text.trim()) return;
    socketRef.current?.emit("send-message", { conversationId: activeConversationId, text });
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeMessages,
        activeConversationId,
        isLoading,
        loadConversations,
        openConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
