import React from 'react';
import { FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const Forbidden = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center space-y-4 bg-base-100 px-4">
      <FaBan className="text-6xl text-error animate-bounce" />
      <h1 className="text-4xl font-bold text-error">Access Denied</h1>
      <p className="text-lg text-gray-500 max-w-md">
        You do not have permission to view this page. Please contact the
        administrator if you believe this is a mistake.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-error"
      >
        Go Back
      </button>
    </div>
  );
};

export default Forbidden;
