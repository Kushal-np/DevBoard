import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing";
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


const AppRoutes = () => {

  return (
    <Routes>
      <Route element={<Layout />}>

        {/* Guest only */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private */}
        <Route element={<PrivateRoutes />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;