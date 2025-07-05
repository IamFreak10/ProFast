import { createBrowserRouter } from 'react-router';

import RootLayout from '../Layouts/RootLayout';
import Home from '../Pages/Home/Home';
import AuthLayout from '../Layouts/AuthLayout';
import Login from '../Pages/AUthentication/Login/Login';
import Register from '../Pages/AUthentication/Register/Register';
import Coverage from '../Pages/Coverage/Coverage';
import PrivateRoutes from '../Routes/PrivateRoutes';
import SendParcel from '../Pages/SendParcel/SendParcel';
import DashBordLayout from '../Layouts/DashBordLayout';
import MyParcels from '../Pages/DashBord/MyParcels/MyParcels';
import Payment from '../Pages/DashBord/Payment/Payment';
import PyamentHistory from '../Pages/DashBord/Payment/PyamentHistory';
import TrackParcel from '../Pages/TrackPArcel/TrackParcel';
import BeARider from '../Pages/DashBord/BeARider/BeARider';
import PendingRiders from '../Pages/DashBord/PendingRiders/PendingRiders';
import ActiveRiders from '../Pages/DashBord/ActiveRiders/ActiveRider';
import MakeAdmin from '../Pages/DashBord/MakeAdmin/MakeAdmin';
import AdminRoute from '../Routes/AdminRoute';
import Forbidden from '../Pages/Forbidden/Forbidden';
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'coverage',
        Component: Coverage,
      },
      {
        path: 'beArider',
        element: (
          <PrivateRoutes>
            <BeARider></BeARider>
          </PrivateRoutes>
        ),
      },
      {
        path: 'forbidden',
        Component: Forbidden,
      },
      {
        path: 'sendparcel',
        element: (
          <PrivateRoutes>
            <SendParcel></SendParcel>
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoutes>
        <DashBordLayout></DashBordLayout>
      </PrivateRoutes>
    ),

    children: [
      {
        path: 'myParcels',
        Component: MyParcels,
      },
      {
        path: 'payment/:id',
        Component: Payment,
      },
      {
        path: 'paymentHistory',
        Component: PyamentHistory,
      },
      {
        path: 'track',
        Component: TrackParcel,
      },
      {
        path: 'active-riders',
        // Component: ActiveRiders,
        element: (
          <AdminRoute>
            <ActiveRiders />
          </AdminRoute>
        ),
      },
      {
        path: 'pending-riders',
        // Component: PendingRiders,
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: 'make-admin',

        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
]);
