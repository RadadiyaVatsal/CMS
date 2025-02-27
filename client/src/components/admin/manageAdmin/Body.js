import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, deleteAdmin } from "../../../redux/actions/adminActions";
import { Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const admins = useSelector((state) => state.admin.admins?.result || []);
  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    dispatch(getAdmin({}));
  }, [dispatch]);

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await dispatch(deleteAdmin({ adminId }));
        toast.success("Admin deleted successfully");
        dispatch(getAdmin({}));
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast.error("Failed to delete admin");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Management</h2>
        <button
          onClick={() => navigate("/admin/addadmin")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Admin
        </button>
      </div>
      {selectedAdmin ? (
        <div className="border border-gray-300 p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold">Admin Details</h3>
          {selectedAdmin.name.toLowerCase() !== "dummy" && (
            <>
              <p><strong>Name:</strong> {selectedAdmin.name}</p>
              <p><strong>Email:</strong> {selectedAdmin.email}</p>
              <p><strong>Department:</strong> {selectedAdmin.department}</p>
              <p><strong>Contact Number:</strong> {selectedAdmin.contactNumber}</p>
              <p><strong>DOB:</strong> {selectedAdmin.dob}</p>
              <p><strong>Joining Year:</strong> {selectedAdmin.joiningYear}</p>
            </>
          )}
          <button 
            className="mt-3 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700" 
            onClick={() => setSelectedAdmin(null)}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">Loading...</td>
                </tr>
              ) : admins.length > 0 ? (
                admins.filter(admin => admin.name.toLowerCase() !== "dummy").map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{admin.name}</td>
                    <td className="border border-gray-300 p-2">{admin.department}</td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Body;
