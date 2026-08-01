// src/pages/ChatPage.tsx
import { Outlet } from "react-router-dom";
import ChatList from "../components/Chat/ChatList";

const ChatPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-80 shrink-0 border-r border-border md:block">
        <ChatList />
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;