import React, { useEffect, useState } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudent,
  getTestMarks,
  uploadMark,
  getTest,
} from "../../../redux/actions/facultyActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { MARKS_UPLOADED, SET_ERRORS } from "../../../redux/actionTypes";

// Student Table Component
const StudentTable = ({ students, marks, handleInputChange , totalMarks }) => {
  
  return (
    <div className="w-full table-auto border-collapse border border-gray-300">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Sr. No.</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Semester</th>
            <th className="border border-gray-300 p-2">Total</th>
            <th className="border border-gray-300 p-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student, idx) => (
            <tr key={student._id}>
              <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 p-2">{student.name}</td>
              <td className="border border-gray-300 p-2">{student.username}</td>
              <td className="border border-gray-300 p-2">{student.semester}</td>
              <td className="border border-gray-300 p-2">{totalMarks}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={marks.find(mark => mark.student === student._id)?.marks || ""}
                  onChange={(e) => handleInputChange(e.target.value, student._id)}
                  className="border border-gray-300 p-1 w-full"
                />
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
  const user = JSON.parse(localStorage.getItem("user"));

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState([]);
  const [value, setValue] = useState({ test: "" });
  const [search, setSearch] = useState(false);

  const store = useSelector((state) => state);
  const tests = store.faculty.tests;
  const students = useSelector((state) => state.admin.students?.result);

  const [data, setData] = useState([]);
  const [maxMarks, setMaxMarks] = useState(0); // For storing max marks for selected test

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
      setValue({ test: "" });
    }
  }, [store.errors]);

  // Log the tests when they are updated
  useEffect(() => {
   // console.log(tests);
  }, [tests]);

  useEffect(() => {
    dispatch(getTest({ faculty: user.result._id }));
    dispatch({ type: SET_ERRORS, payload: {} });
    setValue({ ...value, department: user.result.department });
  }, []);

  useEffect(() => {
    if (store.errors || store.faculty.marksUploaded) {
      setLoading(false);
      if (store.faculty.marksUploaded) {
        setValue({ test: "" });
        setSearch(false);
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: MARKS_UPLOADED, payload: false });
      }
    }
  }, [store.errors, store.faculty.marksUploaded]);

  const handleInputChange = (newValue, _id) => {
    // Ensure marks are within maxMarks for the selected test
    if (parseInt(newValue) > maxMarks) {
      alert(`Marks can not exceed ${maxMarks}`);
      newValue = 0;
    }

    // Update or remove the marks entry based on input
    const newMarks = [...marks];
    const index = newMarks.findIndex((m) => m._id === _id);

    if (!/^\d*$/.test(newValue)) return; // Prevent invalid input
    if (index === -1) {
      newMarks.push({ _id, value: newValue });
    } else {
      newMarks[index].value = newValue;
    }

    setMarks(newMarks);

    // Update data array
    const newData = [...data];
    const dataIndex = newData.findIndex(
      (mark) => mark?.student === _id && mark?.exam === value.test
    );

    if (dataIndex !== -1) {
      newData[dataIndex].marks = newValue || ""; // Update marks or set empty
    } else if (newValue !== "") {
      newData.push({ student: _id, marks: newValue, exam: value.test });
    }
    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});

    const updatedValue = {
      ...value,
      faculty: user.result._id,
      department: user.result.department,
    };
    dispatch(getStudent(updatedValue));

    try {
      const response = await getTestMarks({ ...value });
      dispatch(getTest({ faculty: user.result._id }));
      setData(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError({ backendError: "Failed to fetch test marks" });
    }
  };

  const uploadMarks = () => {
    setError({});
    dispatch(uploadMark(marks, { department: user.result.department }, value.test));
    setMarks([]); // Reset marks after upload
  };

  useEffect(() => {
    if (students?.length !== 0) {
      setLoading(false);
    }
  }, [students]);

  // Set the max marks when a test is selected
  const handleTestChange = (e) => {
    setValue({ ...value, test: e.target.value });
    const selectedTest = tests.find((test) => test._id === e.target.value);
    setMaxMarks(selectedTest?.totalMarks || 0); // Set max marks for selected test
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <BoyIcon />
          <h1>All Students</h1>
        </div>
        <div className="mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}
          >
            <label htmlFor="test">Test</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.test}
              onChange={handleTestChange}
            >
              <MenuItem value="">None</MenuItem>
              {tests?.map((test, idx) => (
                <MenuItem value={test._id} key={idx}>
                  {test.test}
                </MenuItem>
              ))}
            </Select>
            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit"
            >
              Search
            </button>
          </form>
          <div className="col-span-3 mr-6">
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Loading"
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.noStudentError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noStudentError || error.backendError}
                </p>
              )}
              {error.marksError && (
                <p className="text-red-500 text-xl font-bold">
                  {error.marksError}
                </p>
              )}
            </div>
            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              students?.length !== 0 && (
                <StudentTable
                  students={students}
                  marks={data}
                  handleInputChange={handleInputChange}
                  totalMarks={tests.find(test => test._id === value.test)?.totalMarks}
                />
              )}
            {search && Object.keys(error).length === 0 && (
              <div className="">
                <button
                  onClick={uploadMarks}
                  className={`${classes.adminFormSubmitButton} mt-10 w-56`}
                >
                  Submit Marks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
