import { Routes, Route } from "react-router-dom";


import LandingPage from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "../components/layout/LayoutFormat";
import Feed from "../pages/Feed";


const AppRoutes = () => {


    return (

        <Routes>


            <Route element={<Layout />}>


                {/* Public */}



                {/* Guest only */}
                <Route element={<PublicRoutes />}>
                    <Route
                        path="/home"
                        element={<LandingPage />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                </Route>



                {/* Private */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/feed" element={<Feed/>}/>
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>


            </Route>


        </Routes>

    )

}


export default AppRoutes;