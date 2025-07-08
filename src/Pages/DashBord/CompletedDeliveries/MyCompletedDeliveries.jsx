import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Swal from 'sweetalert2';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email;

  // Fetch completed parcels assigned to rider
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['completedDeliveries', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders-completed-deliveris`, {
        params: { email },
      });
      return res.data;
    },
  });

  // Calculate rider earning: 75% if same center, else 30%
  const calculateEarning = (parcel) => {
    const cost = Number(parcel.cost) || 0;
    return parcel.senderServiceCenter === parcel.receiverServiceCenter
      ? cost * 0.75
      : cost * 0.3;
  };

  // Mutation for cashout
  const { mutateAsync: cashout, isLoading: cashingOut } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['completedDeliveries', email]);
      Swal.fire('Success', 'Cashout completed.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to cash out. Try again.', 'error');
    },
  });

  const handleCashout = (parcelId) => {
    Swal.fire({
      title: 'Confirm Cashout',
      text: 'You are about to cash out this delivery.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cash Out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        cashout(parcelId);
      }
    });
  };

  return (
    <div className="p-6 bg-base-100 shadow-md rounded-md w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-base-content">
        My Completed Deliveries
      </h2>

      <table className="w-full text-sm text-left border border-base-300">
        <thead className="bg-base-200 text-base-content font-semibold">
          <tr>
            <th className="px-4 py-2 border border-base-300">Tracking ID</th>
            <th className="px-4 py-2 border border-base-300">Title</th>
            <th className="px-4 py-2 border border-base-300">Sender</th>
            <th className="px-4 py-2 border border-base-300">Receiver</th>
            <th className="px-4 py-2 border border-base-300 text-center">
              Cost
            </th>
            <th className="px-4 py-2 border border-base-300 text-center">
              Delivered On
            </th>
            <th className="px-4 py-2 border border-base-300 text-center">
              Your Earning
            </th>
            <th className="px-4 py-2 border border-base-300 text-center">
              Cashout
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" className="text-center py-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="8" className="text-center text-red-500 py-10">
                Failed to load data.
              </td>
            </tr>
          ) : parcels.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="text-center text-base-content/70 py-10"
              >
                No completed deliveries yet.
              </td>
            </tr>
          ) : (
            parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="px-4 py-2 border border-base-300">
                  {parcel.tracking_id}
                </td>
                <td className="px-4 py-2 border border-base-300">
                  {parcel.title}
                </td>
                <td className="px-4 py-2 border border-base-300">
                  {parcel.senderName}
                </td>
                <td className="px-4 py-2 border border-base-300">
                  {parcel.receiverName}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  ৳{parcel.cost}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  {parcel.delivered_at
                    ? new Date(parcel.delivered_at).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center font-semibold text-green-600">
                  ৳{calculateEarning(parcel).toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  {parcel.cashout_status === 'cashed_out' ? (
                    <span className="badge badge-success text-xs px-2 py-1 whitespace-nowrap">
                      Cashed Out
                    </span>
                  ) : (
                    <button
                      className="btn btn-sm btn-warning"
                      disabled={cashingOut}
                      onClick={() => handleCashout(parcel._id)}
                    >
                      Cashout
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedDeliveries;
