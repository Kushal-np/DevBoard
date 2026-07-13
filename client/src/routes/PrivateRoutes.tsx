import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/layout/SideBar";


const PrivateRoutes = () => {

    const {
        isAuthenticated,
        isLoading
    } = useAuth();


    if(isLoading){
        return <div>Loading...</div>
    }


    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }


    return (
        <div className="flex min-h-screen bg-background">


            <main className="flex-1 p-6">
                <Outlet/>
            </main>

        </div>
    )

}


export default PrivateRoutes;