// src/components/layout/Layout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./SideBar";
import TrendBar from "../shared/TrendBar";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="w-full flex justify-center">
          <div className="w-full max-w-[1200px] px-4 py-4 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        {/* Left Sidebar - Reduced width */}
        <aside className="hidden md:block md:w-[220px] md:shrink-0 md:sticky md:top-0 md:h-screen md:border-r md:border-border/40">
          <Sidebar />
        </aside>

        {/* Main Content - Middle - Slightly reduced */}
       <main className="flex-1 min-w-0 w-full px-0 md:px-6 py-2 pb-24 md:py-6 md:pb-8">
          <Outlet />
        </main>

        {/* Right Sidebar - TrendBar - Increased width */}
        <div className="hidden lg:block lg:w-[380px] lg:shrink-0">
          <TrendBar />
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;