import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { BarLoader, ScaleLoader } from 'react-spinners';
import TableLoader from '../../Shared/Loaders/TableLoaders/TableLoader';

const PyamentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payment-history', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });
  if (isPending) {
    return <TableLoader></TableLoader>;
  }
  if (payments.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        No payment history found.
      </div>
    );
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // const options = {
    //   year: 'numeric',
    //   month: 'short',
    //   day: 'numeric',
    //   hour: '2-digit',
    //   minute: '2-digit',
    // };
    // return new Date(dateString).toLocaleDateString(undefined, options);
    return date.toLocaleString();
  };
  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Payment History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Parcel ID
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Amount (USD)
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Payment Method
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Transaction ID
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                Paid At
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-gray-50 border border-gray-200"
              >
                <td className="border border-gray-300 px-4 py-3 text-gray-800 break-words max-w-xs">
                  {payment.parcel_id}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-800 font-semibold">
                  ${payment.amount}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-800 capitalize">
                  {payment.paymentMethod.join(', ')}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-600 break-all max-w-xs">
                  {payment.transactionId}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700">
                  {formatDate(payment.paid_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PyamentHistory;
