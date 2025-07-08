import { useQuery } from '@tanstack/react-query';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from 'date-fns';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';


const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['completedDeliveries', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const cost = Number(parcel.cost);
    return parcel.senderServiceCenter === parcel.receiverServiceCenter
      ? cost * 0.8
      : cost * 0.3;
  };

  // Filtered earnings
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    today = 0,
    week = 0,
    month = 0,
    year = 0;

  parcels.forEach((p) => {
    const earning = calculateEarning(p);
    const deliveredAt = new Date(p.delivered_at);
    total += earning;
    if (p.cashout_status === 'cashed_out') totalCashedOut += earning;
    else totalPending += earning;

    if (isAfter(deliveredAt, todayStart)) today += earning;
    if (isAfter(deliveredAt, weekStart)) week += earning;
    if (isAfter(deliveredAt, monthStart)) month += earning;
    if (isAfter(deliveredAt, yearStart)) year += earning;
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Earnings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{total.toFixed(2)}
              </p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Cashed Out</p>
              <p className="text-2xl font-bold text-blue-600">
                ৳{totalCashedOut.toFixed(2)}
              </p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl shadow">
              <p className="text-lg font-semibold">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                ৳{totalPending.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold text-green-700">
                ৳{today.toFixed(2)}
              </p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-xl font-bold text-green-700">
                ৳{week.toFixed(2)}
              </p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-xl font-bold text-green-700">
                ৳{month.toFixed(2)}
              </p>
            </div>
            <div className="bg-base-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">This Year</p>
              <p className="text-xl font-bold text-green-700">
                ৳{year.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEarnings;
