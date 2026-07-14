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
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] lg:gap-8 lg:px-8">
        <aside className="hidden md:block md:w-[240px] md:shrink-0 md:sticky md:top-0 md:h-screen md:border-r md:border-border/60">
          <Sidebar />
        </aside>

        <main className="flex-1 min-w-0 w-full pb-24 pt-0 md:pb-8 md:pt-6">
          <Outlet />
        </main>

        <div className="hidden lg:block lg:w-[320px] lg:shrink-0">
          <TrendBar />
        </div>

        <div className="md:hidden">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;