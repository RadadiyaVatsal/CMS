import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteStudent,
  getAllBatch,
  getAllStudent,
} from "../../../redux/actions/adminActions";
import { MenuItem, Select, IconButton, Button } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const batches = useSelector((state) => state.admin.allBatch);
  const allStudents = useSelector((state) => state.admin.allStudent || []);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    batch: "",
    semester: "",
  });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    dispatch(getAllBatch());
    dispatch(getAllStudent());
  }, []);

  useEffect(() => {
    setFilteredStudents(allStudents);
  }, [allStudents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});

    let filtered = allStudents;

    if (value.department)
      filtered = filtered.filter((stu) => stu.department === value.department);
    if (value.batch)
      filtered = filtered.filter((stu) => stu.batchId === value.batch);
    if (value.semester)
      filtered = filtered.filter(
        (stu) => stu.semester === Number(value.semester)
      );

    setFilteredStudents(filtered);
    setLoading(false);
  };

  const handleDelete = (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      dispatch(deleteStudent({ studentId }));
      dispatch(getAllStudent());
    }
  };
  const StudentDetails = ({ student, onClose }) => {
    return (
      <div className="p-5 border rounded-lg shadow-lg bg-white w-1/3 mx-auto">
        <h2 className="text-xl font-bold mb-3">Student Details</h2>
        <p>
          <strong>Name:</strong> {student.name}
        </p>
        <p>
          <strong>Semester:</strong> {student.semester}
        </p>
        <p>
          <strong>Department:</strong> {student.department}
        </p>
        <p>
          <strong>Batch:</strong> {student.batchName}
        </p>
        <p>
          <strong>DOB:</strong> {student.dob}
        </p>
        <p>
          <strong>Contact number:</strong> {student.contactNumner}
        </p>
        <p>
          <strong>Gender:</strong> {student.gender}
        </p>
        <button
          onClick={onClose}
          className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center space-x-2">
            <BoyIcon />
            <h1>All Students</h1>
          </div>
          {/* Add Student Button */}
        </div>

        <form className="mr-10 bg-white p-6 rounded-xl" onSubmit={handleSubmit}>
          <div className="flex space-x-4 items-end">
            <div>
              <label className="block text-sm text-gray-600">
                Select Department
              </label>
              <Select
                value={value.department}
                onChange={(e) =>
                  setValue({ ...value, department: e.target.value })
                }
                sx={{ height: 36, width: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {departments?.map((dp, idx) => (
                  <MenuItem key={idx} value={dp.department}>
                    {dp.department}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">
                Select Batch
              </label>
              <Select
                value={value.batch}
                onChange={(e) => setValue({ ...value, batch: e.target.value })}
                sx={{ height: 36, width: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {batches?.map((bt, idx) => (
                  <MenuItem key={idx} value={bt._id}>
                    {bt.startYear} - {bt.endYear}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">
                Select Semester
              </label>
              <Select
                value={value.semester}
                onChange={(e) =>
                  setValue({ ...value, semester: e.target.value })
                }
                sx={{ height: 36, width: 180 }}
              >
                <MenuItem value="">All</MenuItem>
                {[...Array(8)].map((_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <button
              className={`${classes.adminFormSubmitButton} rounded-md`}
              type="submit"
              style={{ height: 40, width: 140 }} // Set width & height
            >
              Search
            </button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/addstudent")}
              sx={{ height: 40, width: 140 }} // Set width & height
              className="bg-blue-600 hover:bg-blue-800 text-white rounded-md"
            >
              Add Student
            </Button>
          </div>
        </form>

        <div className="flex-[0.8] mt-3">
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          ) : (
            <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
              <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Semester</th>
                    <th className="border border-gray-300 p-2">Department</th>
                    <th className="border border-gray-300 p-2">Batch</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2 text-center">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-300 p-2">{stu.name}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {stu.semester}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {stu.department}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {stu.batchName}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <IconButton onClick={() => setSelectedStudent(stu)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(stu._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
