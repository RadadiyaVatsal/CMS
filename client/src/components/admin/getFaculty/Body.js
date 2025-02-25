import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { getFaculty, deleteFaculty } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";

const FacultyTable = ({ faculties, handleDelete }) => {
  return (
    <div className="w-full table-auto border-collapse border border-gray-300">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Sr. No.</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Designation</th>
            <th className="border border-gray-300 p-2">Department</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((fac, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 p-2">{fac.name}</td>
              <td className="border border-gray-300 p-2">{fac.username}</td>
              <td className="border border-gray-300 p-2">{fac.email}</td>
              <td className="border border-gray-300 p-2">{fac.designation}</td>
              <td className="border border-gray-300 p-2">{fac.department}</td>
              <td className="border border-gray-300 p-2 text-center">
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
      
      // Fetch updated faculties from backend
      await dispatch(getFaculty({ department: selectedDepartment || "" }));
  
      // Ensure filteredFaculties updates only after Redux store is updated
      setFilteredFaculties(
        faculties.filter((fac) => fac._id !== facultyId)
      );
    } catch (error) {
      console.error("Error deleting faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    setLoading(true);
  
    // Fetch new faculty data from backend
    await dispatch(getFaculty({ department: department || "" }));
  
    // Ensure filteredFaculties updates only after Redux state is updated
    setFilteredFaculties((prev) => {
      const updatedFaculties = faculties.filter((fac) => fac.department === department);
      return updatedFaculties.length ? updatedFaculties : []; // If no faculties, set empty array
    });
  
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

        {loading ? <Spinner /> : <FacultyTable faculties={filteredFaculties} handleDelete={handleDelete} />}
      </div>
    </div>
  );
};

export default Body;
