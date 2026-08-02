import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "../components/layout/LayoutFormat";
import Feed from "../pages/Feed";
import Settings from "../pages/Settings";
import Bookmarks from "../pages/Bookmarks";
import Likes from "../pages/Likes";
import Chat from "../pages/Chat";
import HomeRedirect from "../components/features/HomeRedirect";
import Post from "../pages/Post";
import ChatPage from "../pages/ChatPage";
import Notifications from "../pages/Notifications";
import Search from "../pages/Search";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Guest only */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private */}
        <Route element={<PrivateRoutes />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/chat" element={<ChatPage />}>
            <Route
              index
              element={
                <div className="hidden h-full items-center justify-center text-text-secondary md:flex">
                  Select a conversation
                </div>
              }
            />
            <Route path=":conversationId" element={<Chat />} />
          </Route>
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
