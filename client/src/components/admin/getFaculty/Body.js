import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { getFaculty, deleteFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";

const FacultyTable = ({ faculties, handleDelete, handleView }) => {
  return (
    <div className="flex-[0.8] mt-3">
      <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        {/* Ensure proper height for scrollable area */}
        <div style={{ maxHeight: "400px", overflowY: "auto" , overflowX: "atuo" , width: "100%" }} className="relative overflow-y-scroll max-h-[400px] min-h-[350px] pb-10">
  <table className="w-full table-auto border-collapse border border-gray-300">

            {/* Sticky Header */}
            <thead className="top-0 bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Sr. No.</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((fac, idx) => (
                <tr key={idx} className="min-h-[50px]">
                  <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                  <td className="border border-gray-300 p-2">{fac.name}</td>
                  <td className="border border-gray-300 p-2">{fac.department}</td>
                  <td className="border border-gray-300 p-2 text-center flex justify-center space-x-2">
                    <button
                      onClick={() => handleView(fac)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      <VisibilityIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDelete(fac._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FacultyDetails = ({ faculty, onClose }) => {
  return (
    <div className="p-5 border rounded-lg shadow-lg bg-white w-1/3 mx-auto mt-5">
      <h2 className="text-xl font-bold mb-3">Faculty Details</h2>
      <p><strong>Name:</strong> {faculty.name}</p>
      <p><strong>Username:</strong> {faculty.username}</p>
      <p><strong>Email:</strong> {faculty.email}</p>
      <p><strong>Designation:</strong> {faculty.designation}</p>
      <p><strong>Department:</strong> {faculty.department}</p>
      <p><strong>DOB:</strong> {faculty.dob}</p>
      <p><strong>Gender:</strong> {faculty.gender}</p>
      <p><strong>Contact number:</strong> {faculty.contactNumber}</p>
      <p><strong>Joining Year:</strong> {faculty.joiningYear}</p>
      <button 
        onClick={onClose} 
        className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Close
      </button>
    </div>
  );
};

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const faculties = useSelector((state) => state.admin.faculties);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    dispatch(getFaculty({}));
  }, [dispatch]);

  useEffect(() => {
    if (faculties.length !== 0) {
      setLoading(false);
      setFilteredFaculties(faculties);
    }
  }, [faculties]);

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }
    setLoading(true);
    try {
      await dispatch(deleteFaculty({ facultyId }));
      await dispatch(getFaculty({ department: selectedDepartment || "" }));
      setFilteredFaculties(faculties.filter((fac) => fac._id !== facultyId));
    } catch (error) {
      console.error("Error deleting faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleClose = () => {
    setSelectedFaculty(null);
  };

  const handleDepartmentChange = async (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    setLoading(true);
    await dispatch(getFaculty({ department: department || "" }));
    setFilteredFaculties(faculties.filter((fac) => fac.department === department));
    setLoading(false);
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1>All Faculty</h1>
          <button
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              navigate("/admin/addfaculty");
              dispatch(getFaculty({}));
            }}
          >
            <AddIcon /> Add New Faculty
          </button>
        </div>
        
        <div className="flex space-x-4 items-center">
          <label htmlFor="department">Department:</label>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            displayEmpty
            sx={{ height: 36, width: 224 }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments?.map((dp, idx) => (
              <MenuItem key={idx} value={dp.department}>
                {dp.department}
              </MenuItem>
            ))}
          </Select>
        </div>

        {loading ? <Spinner /> : 
          selectedFaculty ? 
            <FacultyDetails faculty={selectedFaculty} onClose={handleClose} /> 
          : <FacultyTable faculties={filteredFaculties} handleDelete={handleDelete} handleView={handleView} />
        }
      </div>
    </div>
  );
};

export default Body;
