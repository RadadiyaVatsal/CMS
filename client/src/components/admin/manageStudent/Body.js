import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { deleteStudent, getAllBatch, getAllStudent } from "../../../redux/actions/adminActions";
import { MenuItem, Select, IconButton, Button } from "@mui/material";
import { SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState({
    department: "",
    batch: "",
    semester: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const departments = useSelector((state) => state.admin.allDepartment);
  const batches = useSelector((state) => state.admin.allBatch);
  const allStudents = useSelector((state) => state.admin.allStudent || []);

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
    let filtered = allStudents;
    if (value.department) filtered = filtered.filter((stu) => stu.department === value.department);
    if (value.batch) filtered = filtered.filter((stu) => stu.batchId === value.batch);
    if (value.semester) filtered = filtered.filter((stu) => stu.semester === Number(value.semester));
    setFilteredStudents(filtered);
  };

  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent({ studentId }));
      dispatch(getAllStudent());
    }
  };

  return (
    <div className="flex-[0.8] mt-3">
      {!selectedStudent ? (
        <>
          <div className="space-y-5">
            <div className="flex justify-between items-center text-gray-400">
              <div className="flex items-center space-x-2">
                <BoyIcon />
                <h1>All Students</h1>
              </div>
            </div>

            <form className="mr-10 bg-white p-6 rounded-xl" onSubmit={handleSubmit}>
              <div className="flex space-x-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600">Select Department</label>
                  <Select
                    value={value.department}
                    onChange={(e) => setValue({ ...value, department: e.target.value })}
                    sx={{ height: 36, width: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>{dp.department}</MenuItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Select Batch</label>
                  <Select
                    value={value.batch}
                    onChange={(e) => setValue({ ...value, batch: e.target.value })}
                    sx={{ height: 36, width: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {batches?.map((bt, idx) => (
                      <MenuItem key={idx} value={bt._id}>{bt.startYear} - {bt.endYear}</MenuItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Select Semester</label>
                  <Select
                    value={value.semester}
                    onChange={(e) => setValue({ ...value, semester: e.target.value })}
                    sx={{ height: 36, width: 180 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {[...Array(8)].map((_, i) => (
                      <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                  </Select>
                </div>
                <Button variant="contained" color="primary" type="submit" sx={{ height: 40, width: 140 }}>Search</Button>
              </div>
            </form>

            <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Sr. No.</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Semester</th>
                    <th className="border p-2">Department</th>
                    <th className="border p-2">Batch</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 text-center">{idx + 1}</td>
                      <td className="border p-2">{stu.name}</td>
                      <td className="border p-2 text-center">{stu.semester}</td>
                      <td className="border p-2">{stu.department}</td>
                      <td className="border p-2">{stu.batchName}</td>
                      <td className="border p-2 text-center flex justify-center space-x-2">
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
          </div>
        </>
      ) : (
        <div className="p-5 border rounded-lg shadow-lg bg-white w-1/3 mx-auto mt-5">
          <h2 className="text-xl font-bold mb-3">Student Details</h2>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Semester:</strong> {selectedStudent.semester}</p>
          <p><strong>Department:</strong> {selectedStudent.department}</p>
          <p><strong>Batch:</strong> {selectedStudent.batchName}</p>
          <p><strong>DOB:</strong> {selectedStudent.dob}</p>
          <p><strong>Contact:</strong> {selectedStudent.contactNumber}</p>
          <p><strong>Gender:</strong> {selectedStudent.gender}</p>
          <button onClick={() => setSelectedStudent(null)} className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
        </div>
      )}
    </div>
  );
};

export default Body;