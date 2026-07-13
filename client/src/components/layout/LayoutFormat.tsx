import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./SideBar";


const Layout = () => {

    const { isAuthenticated } = useAuth();


    return (
        <div className="min-h-screen bg-background text-text">

            {
                isAuthenticated 
                ?
                (
                    <div className="flex">

                        <Sidebar />

                        <main className="flex-1">
                            <Outlet />
                        </main>

                    </div>
                )
                :
                (
                    <>
                        <Navbar />

                        <main>
                            <Outlet />
                        </main>
                    </>
                )
            }


        </div>
    );
};


export default Layout;