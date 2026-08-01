import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import type { IChatUser, IConversation, IMessage } from "../types/Message";
import {
  getConversations as fetchConversations,
  startConversation,
  getMessages as fetchMessages,
  getConversationById as fetchConversationById,
} from "../api/services/chat.service";

export type { IChatUser, IConversation, IMessage };

interface ChatContextType {
  connected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  onReceiveMessage: (callback: (message: IMessage) => void) => () => void;
  getConversations: () => Promise<IConversation[]>;
  getOrCreateConversation: (recipientId: string) => Promise<IConversation>;
  getMessages: (conversationId: string) => Promise<IMessage[]>;
  getConversationById: (conversationId: string) => Promise<IConversation>; // add
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:8000", {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) {
      console.warn("Socket is not connected");
      return;
    }
    socketRef.current.emit("join-conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (!socketRef.current) {
      console.warn("Socket is not connected");
      return;
    }
    socketRef.current.emit("leave-conversation", conversationId);
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!socketRef.current) {
      console.warn("Socket is not connected");
      return;
    }
    if (!text.trim()) return;

    socketRef.current.emit("send-message", { conversationId, text });
  }, []);

  const onReceiveMessage = useCallback((callback: (message: IMessage) => void) => {
    if (!socketRef.current) {
      console.warn("Socket is not connected");
      return () => {};
    }

    socketRef.current.on("receive-message", callback);

    return () => {
      socketRef.current?.off("receive-message", callback);
    };
  }, []);

  const getConversations = useCallback(async (): Promise<IConversation[]> => {
    const res = await fetchConversations();
    return res.conversations;
  }, []);

const getConversationById = useCallback(
  async (conversationId: string): Promise<IConversation> => {
    const res = await fetchConversationById(conversationId);
    return res.conversation;
  },
  []
);
  const getOrCreateConversation = useCallback(
    async (recipientId: string): Promise<IConversation> => {
      const res = await startConversation(recipientId);
      return res.conversation;
    },
    []
  );

  const getMessages = useCallback(async (conversationId: string): Promise<IMessage[]> => {
    const res = await fetchMessages(conversationId);
    return res.messages;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        connected,
        joinConversation,
        leaveConversation,
        sendMessage,
        onReceiveMessage,
        getConversations,
        getOrCreateConversation,
        getMessages,
        getConversationById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};