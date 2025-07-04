import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // 🟡 Load Active Riders with React Query
  const { data: riders = [], isLoading, refetch, error } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  // 🔴 Handle Deactivation
  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "deactivated" });
      Swal.fire("Done", "Rider has been deactivated", "success");
      refetch();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to deactivate rider", "error");
    }
  };

  // 🔎 Filtered List
  const filteredRiders = riders.filter((rider) =>
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

      {/* 🔍 Search Field */}
      <div className="mb-4 flex items-center gap-2">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🌀 Loading/Error */}
      {isLoading && <p className="text-center">Loading active riders...</p>}
      {error && <p className="text-center text-red-500">Failed to load riders</p>}

      {/* 📊 Rider Table */}
      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Bike</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr key={rider._id}>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.bike_brand} - {rider.bike_registration}</td>
                  <td><span className="badge badge-success text-white">Active</span></td>
                  <td>
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm btn-error"
                    >
                      <FaUserSlash className="mr-1" /> Deactivate
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRiders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500">
                    No matching riders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;