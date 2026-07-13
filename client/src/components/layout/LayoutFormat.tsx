import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./SideBar";

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-text">
      {isAuthenticated ? (
        <div className="mx-auto flex min-h-screen w-full md:max-w-[1800px]">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:w-[260px] md:shrink-0 md:sticky md:top-0 md:h-screen md:border-r md:border-border">
            <Sidebar />
          </aside>

          {/* Mobile bottom nav (Sidebar internally guards which version renders) */}
          <div className="md:hidden">
            <Sidebar />
          </div>

          {/* Content */}
          <main
            className="
            flex-1
            min-w-0
            w-full
            px-4
            py-4
            pb-24
            md:px-10
            md:py-8
            md:pb-8
            lg:px-14
            "
          >
            <Outlet />
          </main>
        </div>
      ) : (
        <>
          <Navbar />

          <main className="w-full flex justify-center">
            <div className="w-full max-w-[1200px] px-4 py-4 md:px-6 md:py-6">
              <Outlet />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Layout;