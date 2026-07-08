import {Routes, Route} from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import PublicRoutes from "./PublicRoutes"

const AppRoutes = () =>{
    return(
        <div>
           <Navbar/>
           <Routes>
             <Route element={<PublicRoutes/>}>

             </Route>
            </Routes> 
        </div>
    )
}