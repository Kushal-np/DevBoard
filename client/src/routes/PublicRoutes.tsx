import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const PublicRoutes = () => {

  const {
    isLoading,
  } = useAuth();


  if(isLoading){
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }





  return <Outlet/>;

};


export default PublicRoutes;