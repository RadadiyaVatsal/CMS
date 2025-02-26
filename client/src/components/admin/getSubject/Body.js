import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubject, deleteSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select, IconButton, Button } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { SET_ERRORS } from "../../../redux/actionTypes";

import { getAllBatch } from "../../../redux/actions/adminActions";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const store = useSelector((state) => state);

  const departments = useSelector((state) => state.admin.allDepartment);
  const batches = useSelector((state) => state.admin.allBatch);
  const subjects = useSelector((state) => state.admin.allSubject || []);

  const [value, setValue] = useState({
    department: "",
    semester: "",
    batch: "",
  });

  const [filteredSubjects, setFilteredSubjects] = useState(subjects);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    dispatch(getAllSubject());
   dispatch(getAllBatch())
  }, [dispatch]);

  useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});

    let filtered = subjects;
    if (value.department)
      filtered = filtered.filter((sub) => sub.department === value.department);
    if (value.semester)
      filtered = filtered.filter((sub) => sub.semester === Number(value.semester));
    if (value.batch)
      filtered = filtered.filter((sub) => sub.batchId === value.batch);

    setFilteredSubjects(filtered);
    setLoading(false);
  };

  const handleDelete = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      dispatch(deleteSubject({ subjectId }));
      setFilteredSubjects((prev) => prev.filter((sub) => sub._id !== subjectId));
    }
  };

  const SubjectDetails = ({ subject, onClose }) => (
    <div className="p-5 border rounded-lg shadow-lg bg-white w-1/3 mx-auto">
      <h2 className="text-xl font-bold mb-3">Subject Details</h2>
      <p><strong>Name:</strong> {subject.subjectName}</p>
      <p><strong>Code:</strong> {subject.subjectCode}</p>
      <p><strong>Department:</strong> {subject.department}</p>
      <p><strong>Semester:</strong> {subject.semester}</p>
      <p><strong>Total Lectures:</strong> {subject.totalLectures}</p>
      <p><strong>Batch:</strong> {subject.batchName}</p>
      <button onClick={onClose} className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
    </div>
  );

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center space-x-2">
            <MenuBookIcon />
            <h1>All Subjects</h1>
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
                {departments.map((dp, idx) => (
                  <MenuItem key={idx} value={dp.department}>
                    {dp.department}
                  </MenuItem>
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
                {batches.map((bt, idx) => (
                  <MenuItem key={idx} value={bt._id}>
                    {bt.startYear} - {bt.endYear}
                  </MenuItem>
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
            <button className={`${classes.adminFormSubmitButton} rounded-md`} type="submit" style={{ height: 40, width: 140 }}>
              Search
            </button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/admin/addsubject")}
              sx={{ height: 40, width: 250 }}
              className="bg-blue-600 hover:bg-blue-800 text-white rounded-md"
            >
             + Add New Subject
            </Button>
          </div>
        </form>

        <div className="flex-[0.8] mt-3">
          {selectedSubject ? (
            <SubjectDetails subject={selectedSubject} onClose={() => setSelectedSubject(null)} />
          ) : (
            <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
              <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Code</th>
                    <th className="border border-gray-300 p-2">Department</th>
                    <th className="border border-gray-300 p-2">Semester</th>
                    <th className="border border-gray-300 p-2">Batch</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                      <td className="border border-gray-300 p-2">{sub.subjectName}</td>
                      <td className="border border-gray-300 p-2">{sub.subjectCode}</td>
                      <td className="border border-gray-300 p-2">{sub.department}</td>
                      <td className="border border-gray-300 p-2">{sub.semester}</td>
                      <td className="border border-gray-300 p-2">{sub.batchName}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <IconButton onClick={() => setSelectedSubject(sub)}><VisibilityIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(sub._id)}><DeleteIcon /></IconButton>
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
