import React from 'react';
import { Link, NavLink } from 'react-router';
import ProFastLogo from '../Profastlogo/ProFastLogo';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user,logOut } = useAuth();
  const hanndleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        logOut();
        Swal.fire(
          'Logout!',
          'You have been logged out.',
          'success'
        )
      }
    })
    
  };
  const navitems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      <li>
        <NavLink to="/sendparcel">Send Parcel</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      <li>
        <NavLink to="/beArider">Be A Rider</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{' '}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navitems}
          </ul>
        </div>
        <button className="btn btn-ghost text-xl">
          <ProFastLogo></ProFastLogo>
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navitems}</ul>
      </div>
      <div className="navbar-end">
        {
          user?.email?<button onClick={hanndleLogout} className="btn btn-primary">Logout</button>:<Link to="/login"><button className="btn btn-primary">Login</button></Link>
        }
      </div>
    </div>
  );
};

export default Navbar;
