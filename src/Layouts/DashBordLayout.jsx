import React from 'react';
import { NavLink, Outlet } from 'react-router';
import ProFastLogo from '../Pages/Shared/Profastlogo/ProFastLogo';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClipboardList,
  FaHistory,
  FaHome,
  FaMoneyBillWave,
  FaMotorcycle,
  FaSearchLocation,
  FaUserCheck,
  FaUserClock,
  FaUserEdit,
} from 'react-icons/fa';
import useUserRole from '../Hooks/useUserRole';

const DashBordLayout = () => {
  const { role, roleLoading } = useUserRole();

  return (
    <div border className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Navbar Title</div>
        </div>
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2">
          {/* Sidebar content here */}
          <ProFastLogo />

          <li>
            <NavLink to="/dashboard" className="flex items-center gap-2">
              <FaHome />
              <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/myParcels"
              className="flex items-center gap-2"
            >
              <FaBoxOpen /> {/* optional icon for better UX */}
              <span>My Parcels</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className="flex items-center gap-2"
            >
              <FaHistory />
              {/* optional icon for better UX */}
              <span>Payment History</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track" className="flex items-center gap-2">
              <FaSearchLocation /> {/* optional icon */}
              <span>Track A Parcel</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/UpdateProfile"
              className="flex items-center gap-2"
            >
              <FaUserEdit /> {/* optional icon */}
              <span>Update Profile</span>
            </NavLink>
          </li>
          {/* Rider Links */}

          {!roleLoading && role === 'rider' && (
            <>
              <li>
                <NavLink to="/dashboard/pending-deliveries">
                  <FaClipboardList className="inline-block mr-2" />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/completed-deliveries">
                  <FaCheckCircle className="inline-block mr-2" />
                  My Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-earnings">
                  <FaMoneyBillWave className="inline-block mr-2" />
                  My Earnings
                </NavLink>
              </li>
            </>
          )}
          {/* Admin Links */}
          {!roleLoading && role === 'admin' && (
            <>
              <li>
                <NavLink to="/dashboard/assign-rider">
                  <FaMotorcycle className="inline-block mr-2" />
                  Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/active-riders">
                  <FaUserCheck className="inline-block mr-2" />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/pending-riders">
                  <FaUserClock className="inline-block mr-2" />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/make-admin">
                  <FaUserClock className="inline-block mr-2" />
                  Make Admin
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashBordLayout;
