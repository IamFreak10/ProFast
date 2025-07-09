import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Authenticated rider email
  const { logTracking } = useTrackingLogger();

  // Debug rider email

  const riderEmail = user?.email;
  const {
    data: parcels = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['pendingParcels', riderEmail],
    queryFn: async () => {
      const res = await axiosSecure.get('/rider/parcels', {
        params: { email: riderEmail },
      });
      return res.data;
    },
    enabled: !!riderEmail,
  });
  console.log(parcels);
  const updateDeliveryStatus = async (parcelId, status) => {
    try {
      const res = await axiosSecure.patch(`/rider/parcels/${parcelId}`, {
        delivery_status: status,
      });
      if (status === 'on_transit') {
        await logTracking({
          tracking_id: parcels.tracking_id,
          status: `Picked Up by  ${user?.displayName}`,
          details: `Rider ${user?.displayName} has ppicked up the parcel`,
          updated_by: user?.email,
        });
      }
      if(status === 'delivered'){
        await logTracking({
          tracking_id: parcels.tracking_id,
          status: `Delivered by  ${user?.displayName}`,
          details: `Rider ${user?.displayName} has delivered the parcel`,
          updated_by: user?.email,
        });
      }

      if (res.data.modifiedCount > 0) {
        Swal.fire('Success', `Marked as ${status}`, 'success');
        if (status === 'delivered') {
          await axiosSecure.patch('/rider/status', {
            status: 'active',
            rider_email: user?.email,
          });
        }
        refetch();
      } else {
        Swal.fire('Error', 'Update failed', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  if (!riderEmail) {
    return (
      <div className="text-center text-red-500 py-8">
        Rider email not found. Please log in properly.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-4">
        Failed to load your assigned parcels.
      </p>
    );
  }

  return (
    <div className="p-6 bg-base-100 shadow-md rounded-md w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-base-content">
        Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-base-content/70">
          No pending parcels assigned to you.
        </p>
      ) : (
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
                Status
              </th>
              <th className="px-4 py-2 border border-base-300 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id} className="hover:bg-base-200">
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
                <td className="px-4 py-2 border border-base-300 text-center capitalize">
                  {parcel.delivery_status.replace('_', ' ')}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center space-x-2">
                  {parcel.delivery_status === 'rider_assigned' && (
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() =>
                        updateDeliveryStatus(parcel._id, 'on_transit')
                      }
                    >
                      Picked Up
                    </button>
                  )}
                  {parcel.delivery_status === 'on_transit' && (
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() =>
                        updateDeliveryStatus(parcel._id, 'delivered')
                      }
                    >
                      Delivered
                    </button>
                  )}
                  {!['rider_assigned', 'on_transit'].includes(
                    parcel.delivery_status
                  ) && <span>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingDeliveries;
