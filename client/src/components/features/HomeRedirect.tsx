import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LandingPage from "../../pages/Landing";


function HomeRedirect() {
    const {isAuthenticated} = useAuth();
    return isAuthenticated?(
        <Navigate to="/feed" replace/>
    ):(
        <LandingPage/>
    );
}

export default HomeRedirect ; 