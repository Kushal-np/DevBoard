import {Routes, Route} from "react-router-dom"
import LandingPage from "../pages/Landing"

const AppRoutes = () =>{
    return(
        <div>
           <Routes>
                <Route path="/" element={<LandingPage/>}/>
            </Routes> 
        </div>
    )
}

export default AppRoutes;