import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import Forbidden from '../Pages/Forbidden/Forbidden';
import { useNavigate } from 'react-router';

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button className="btn loading">loading</button>
      </div>
    );
  }
  if (!user || role !== 'admin') {
    navigate('/forbidden');
  }
  return children;
};

export default AdminRoute;
