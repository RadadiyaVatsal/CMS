import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdmin, deleteAdmin } from "../../../redux/actions/adminActions";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get admin data from Redux store (Fix: Properly access `result`)
  const admins = useSelector((state) => state.admin.admins?.result || []);
  const loading = useSelector((state) => state.admin.loading);

  useEffect(() => {
    dispatch(getAdmin({})); // Fetch admins from Redux action
  }, [dispatch]);

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await dispatch(deleteAdmin({ adminId }));
        toast.success("Admin deleted successfully");
        dispatch(getAdmin({})); // Refresh the admin list after deletion
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast.error("Failed to delete admin");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Management</h2>
        <button
          onClick={() => navigate("/admin/addadmin")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Admin
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">Loading...</td>
              </tr>
            ) : admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{admin.name}</td>
                  <td className="border border-gray-300 p-2">{admin.email}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      <Trash2 size={16} />
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
    </div>
  );
};

export default Body;
