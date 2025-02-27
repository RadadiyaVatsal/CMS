import React, { useEffect, useState, useRef } from "react";
import { TextField, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getStudentForAttendance,
  markAttendance,
  updateAttendance,
  getSubject,
} from "../../../redux/actions/facultyActions";
import { SET_ERRORS, ATTENDANCE_MARKED } from "../../../redux/actionTypes";
import axios from "axios";

const Attendance = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch data from Redux
  const subjects = useSelector((state) => state.admin.subjects?.result || []);
  const students = useSelector((state) => state.admin.students || []);
  const errors = useSelector((state) => state.errors);
  let attendance = useSelector((state) => state.faculty.attendance.alreadyAdded);
  const attendanceUploaded = useSelector((state) => state.faculty.attendanceUploaded);

  // State
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkedValue, setCheckedValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const inputRef = useRef([]);

  useEffect(() => {
    dispatch(getSubject({ faculty: user.result._id }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result._id]);

  useEffect(() => {
    if (selectedSubject) {
      setLoading(true);
      dispatch(getStudentForAttendance(selectedSubject))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
      dispatch(updateAttendance(selectedSubject));
    }
  }, [dispatch, selectedSubject]);

  useEffect(() => {
    setTimeout(() => {
      attendance?.forEach((a, idx) => {
        if (inputRef.current[idx]) {
          inputRef.current[idx].checked = a.attended;
          if (a.attended) {
            setCheckedValue((prev) => [...prev, a.student]);
          }
        }
      });
    }, 0);
  }, [attendance]);

  useEffect(() => {
    if (attendanceUploaded) {
      setSelectedSubject("");
      setCheckedValue([]);
      dispatch({ type: ATTENDANCE_MARKED, payload: false });
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [attendanceUploaded, dispatch]);

  const handleInputChange = (e) => {
    const studentId = e.target.value;
    setCheckedValue((prev) =>
      e.target.checked
        ? [...prev, studentId]
        : prev.filter((id) => id !== studentId)
    );
  };

  const uploadAttendance = () => {
    if (!selectedSubject) {
      return alert("Please select a subject.");
    }
    if (checkedValue.length === 0) {
      return alert("Please select at least one student.");
    }
    setLoading(true);
    dispatch(markAttendance(checkedValue, selectedSubject, students)).finally(
      () => setLoading(false)
    );
  };

  useEffect(() => {
    const fetchAttendanceByDate = async () => {
      if (!selectedSubject || !selectedDate) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/attendance/by-date?facultyId=${user.result._id}&date=${selectedDate}`
        );
        setAttendanceRecords(response.data.attendanceRecords || []);

        // Pre-check checkboxes for students with attendance marked
        const attendedStudents = response.data.attendanceRecords.map((record) => record.student._id);
        setCheckedValue(attendedStudents);
      } catch (error) {
        console.error("Error fetching attendance by date:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceByDate();
  }, [selectedSubject, selectedDate]);

  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-xl font-bold mb-4">Attendance Records</h1>
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-lg">Select Date:</label>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          variant="outlined"
          size="small"
        />
        <label className="text-lg">Select Subject:</label>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">None</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject._id} value={subject._id}>
              {subject.subjectName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="w-full max-w-4xl border rounded-lg shadow-md overflow-hidden">
        <div className="overflow-y-auto max-h-[400px]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Sr. No.</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Username</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const isPresent = checkedValue.includes(student._id);
                  return (
                    <tr key={student._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="border p-2 text-center">
                        {isToday ? (
                          <input
                            ref={(checkboxInput) => (inputRef.current[idx] = checkboxInput)}
                            type="checkbox"
                            value={student._id}
                            checked={isPresent}
                            onChange={handleInputChange}
                            className="w-4 h-4"
                          />
                        ) : (
                          <span className={`font-bold ${isPresent ? "text-green-600" : "text-red-600"}`}>
                            {isPresent ? "P" : "A"}
                          </span>
                        )}
                      </td>
                      <td className="border p-2 text-center">{idx + 1}</td>
                      <td className="border p-2">{student.name}</td>
                      <td className="border p-2">{student.username}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isToday && (
        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={uploadAttendance}
        >
          {attendance?.length === 0 ? "Mark Attendance" : "Update Attendance"}
        </button>
      )}
    </div>
  );
};

export default Attendance;