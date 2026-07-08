import {Navigate , Outlet} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PublicRoutes = () =>{
    const {user } = useAuth();
    if(user){
        return <Navigate to ="/home" replace/>;
    }
    return <Outlet/>;
}

export default PublicRoutes;