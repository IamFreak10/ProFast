import React from 'react';
import useUserRole from '../../../Hooks/useUserRole';
import TableLoader from '../../Shared/Loaders/TableLoaders/TableLoader';
import DashBoardAdmin from '../DashBordAdmin/DashBoardAdmin';
import DashBordRider from '../DashBoardRider/DashBordRider';
import DashBoardUser from '../DashBordUser/DashBoardUser';

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) {
    return <TableLoader></TableLoader>;
  }
  if (role === 'admin') {
    return <DashBoardAdmin></DashBoardAdmin>;
  }
  if (role === 'rider') {
    return <DashBordRider></DashBordRider>;
  }
  if (role === 'user') {
    return <DashBoardUser></DashBoardUser>;
  }
};

export default DashboardHome;
