import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import { PropagateLoader } from 'react-spinners';

const PrivateRoutes = ({children}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <PropagateLoader />;
  }
  if(!user){
    return <Navigate state={{from: location.pathname}} to="/login"></Navigate>
  }
  return children;
};

export default PrivateRoutes;
