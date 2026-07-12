import {Routes, Route} from "react-router-dom"
import LandingPage from "../pages/Landing"
import Login from "../pages/Login";
import Navbar from "../components/layout/Navbar";

const AppRoutes = () =>{
    return(
        <div>
            <Navbar/>
           <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={<LandingPage/>}/>
            </Routes> 
        </div>
    )
}

export default AppRoutes;