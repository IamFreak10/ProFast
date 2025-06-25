import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Navbar/Footer/Footer';

const RootLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className=" ">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
