import {Routes, Route} from "react-router-dom"
import PublicRoutes from "./PublicRoutes"
import LandingPage from "../pages/Landing"
import Navbar from "../components/layout/Navbar"
import Login from "../pages/Login"
import Register from "../pages/Register"

const AppRoutes = () =>{
    return(
        <div>
            <Navbar/>
           <Routes>
             <Route element={<PublicRoutes/>}>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
             </Route>
            </Routes> 
        </div>
    )
}

export default AppRoutes;