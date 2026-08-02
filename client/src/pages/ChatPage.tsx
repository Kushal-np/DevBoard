// src/pages/ChatPage.tsx
import { Outlet, useLocation } from "react-router-dom";
import ChatList from "../components/Chat/ChatList";

const ChatPage = () => {
  const location = useLocation();
  const isConversationOpen = /^\/chat\/[^/]+/.test(location.pathname);

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`w-full shrink-0 border-border md:block md:w-80 md:border-r ${
          isConversationOpen ? "hidden md:block" : "block"
        }`}
      >
        <ChatList />
      </aside>

      <div
        className={`flex-1 ${
          isConversationOpen ? "block" : "hidden md:block"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;