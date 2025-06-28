import React from 'react';
import UseAuth from './UseAuth';
import axios from 'axios';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
//   const { user, signOutUser } = UseAuth();

//   // Request Interceptor
//   axiosInstance.interceptors.request.use(async (config) => {
//     if (user) {
      
//       const token = await user.getIdToken();
//       config.headers.authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   // Response Interceptor
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response.status === 401 || error.response.status === 403) {
//         Swal.fire({
//           title: 'Error!',
//           text: 'You are not authorized to access this page. Please login again.',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         }).then(() => {
//           signOutUser();
//         });
//       }
//       return Promise.reject(error);
//     }
//   );

  return axiosInstance;
};

export default useAxiosSecure;
