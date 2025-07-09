import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';
import useAuth from '../../../Hooks/useAuth';

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['assignableParcels'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels', {
        params: {
          payment_status: 'paid',
          delivery_status: 'not_collected',
        },
      });
      return res.data;
    },
  });

  const { data: riders = [] } = useQuery({
    queryKey: ['activeRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders/active');
      return res.data;
    },
  });
  //   alert(riders.length);
  const openModal = (parcel) => {
    setSelectedParcel(parcel);
    document.getElementById('assign_modal').showModal();
  };

  const handleAssign = async (name) => {
    try {
      // 1️⃣ Find Rider by Name
      const selectedRider = riders.find((r) => r.name === name);
      if (!selectedRider) throw new Error('Rider not found');

      // 2️⃣ Update rider status to 'on_delivery'
      await axiosSecure.patch(`/riders/${selectedRider._id}`, {
        status: 'on_delivery',
      });

      // 3️⃣ Update parcel delivery_status to 'on_transit'
      await axiosSecure.patch(`/parcels/${selectedParcel._id}`, {
        delivery_status: 'rider_assigned',
        assigned_rider: selectedRider._id,
        assigned_rider_email: selectedRider.email,
        assigned_rider_phone: selectedRider.phone,
        assigned_rider_name: selectedRider.name,
      });

      // 4️⃣ Show success alert
      Swal.fire(
        'Assigned!',
        `Parcel ${selectedParcel.tracking_id} assigned to ${selectedRider.name}`,
        'success'
      );
      // 5️⃣ Update track of parcel
      await logTracking({
        tracking_id: selectedParcel.tracking_id,
        status: 'Rider Assigned By Admin',
        details: `Parcel assigned to ${selectedRider?.name} by Admin:${user?.displayName}`,
        updated_by: user?.email,
      });

      refetch();

      // 5️⃣ Close modal
      document.getElementById('assign_modal').close();
      setSelectedParcel(null);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message || 'Assignment failed', 'error');
    }
  };

  const getMatchingRiders = () => {
    if (!selectedParcel) return [];
    return riders.filter(
      (rider) => rider.district === selectedParcel.senderDistrict
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-100 shadow-md rounded-md w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-base-content">
        Assign Rider to Parcel
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-base-content/70">
          No parcels available for assignment.
        </p>
      ) : (
        <table className="w-[1000px] text-sm  text-left border border-base-300">
          <thead className="bg-base-200 text-base-content font-semibold">
            <tr>
              <th className="px-4 py-2 border border-base-300">Tracking ID</th>
              <th className="px-4 py-2 border border-base-300">Tiitle</th>
              <th className="px-4 py-2 border border-base-300">Type</th>
              <th className="px-4 py-2 border border-base-300">From</th>
              <th className="px-4 py-2 border border-base-300">To</th>
              <th className="px-4 py-2 border border-base-300 text-center">
                Cost
              </th>
              <th className="px-4 py-2 border border-base-300 text-center">
                Created At
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
                  {parcel.type}
                </td>
                <td className="px-4 py-2 border border-base-300 text-sm">
                  {parcel.senderRegion}, {parcel.senderDistrict},{' '}
                  {parcel.senderServiceCenter}
                </td>
                <td className="px-4 py-2 border border-base-300 text-sm">
                  {parcel.receiverRegion}, {parcel.receiverDistrict},{' '}
                  {parcel.receiverServiceCenter}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  ৳{parcel.cost}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  {new Date(parcel.creation_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-base-300 text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openModal(parcel)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <dialog id="assign_modal" className="modal">
        <div className="modal-box bg-base-100">
          <h3 className="font-bold text-lg mb-2 text-base-content">
            Select a Rider for: {selectedParcel?.tracking_id}
          </h3>
          {getMatchingRiders().length === 0 ? (
            <p className="text-sm text-gray-500">
              No active riders available in {selectedParcel?.senderDistrict}
            </p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {getMatchingRiders().map((rider) => (
                <li
                  key={rider._id}
                  className="border p-3 rounded-md bg-base-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{rider.name}</p>
                    <p className="text-xs text-gray-500">
                      📞 {rider.phone} | {rider.bike_registration}
                    </p>
                  </div>
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => handleAssign(rider.name)}
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
