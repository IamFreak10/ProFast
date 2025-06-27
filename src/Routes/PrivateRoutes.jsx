import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';

const PrivateRoutes = ({children}) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <PropagateLoader />;
  }
  if(!user){
    return <Navigate to="/login"></Navigate>
  }
  return children;
};

export default PrivateRoutes;
