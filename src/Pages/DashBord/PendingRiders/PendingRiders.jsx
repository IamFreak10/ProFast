import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    })

    if (isPending) {
        return '...loading'
    }

    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "approve" ? "active" : "rejected";
            await axiosSecure.patch(`/riders/${id}`, {
                status,
                email,
            });

            refetch();

            Swal.fire("Success", `Rider ${action}d successfully`, "success");

        } catch (err) {
            Swal.fire("Error", "Could not update rider status", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Rider Applications</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Phone</th>
                            <th>Applied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((rider) => (
                            <tr key={rider._id}>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>{rider.phone}</td>
                                <td>{new Date(rider.created_at).toLocaleDateString()}</td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedRider(rider)}
                                        className="btn btn-sm btn-info"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleDecision(rider._id, "approve",rider.email)}
                                        className="btn btn-sm btn-success"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleDecision(rider._id, "reject",rider.email)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing rider details */}
            {selectedRider && (
                <dialog id="riderDetailsModal" className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-xl mb-2">Rider Details</h3>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Email:</strong> {selectedRider.email}</p>
                            <p><strong>Phone:</strong> {selectedRider.phone}</p>
                            <p><strong>Age:</strong> {selectedRider.age}</p>
                            <p><strong>NID:</strong> {selectedRider.nid}</p>
                            <p><strong>Bike Brand:</strong> {selectedRider.bike_brand}</p>
                            <p><strong>Bike Registration:</strong> {selectedRider.bike_registration}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>District:</strong> {selectedRider.district}</p>
                            <p><strong>Applied At:</strong> {new Date(selectedRider.created_at).toLocaleString()}</p>
                            {selectedRider.note && <p><strong>Note:</strong> {selectedRider.note}</p>}
                        </div>

                        <div className="modal-action mt-4">
                            <button
                                className="btn btn-outline"
                                onClick={() => setSelectedRider(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PendingRiders;