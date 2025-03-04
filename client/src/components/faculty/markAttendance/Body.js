import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  getStudentForAttendance,
  markAttendance,
  getSubject,
} from "../../../redux/actions/facultyActions";
import { SET_ERRORS, ATTENDANCE_MARKED } from "../../../redux/actionTypes";

const Attendance = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  const subjects = useSelector((state) => state.admin.subjects?.result || []);
  const students = useSelector(
    (state) => state.faculty.attendanceData?.students || []
  );
  const attendance = useSelector(
    (state) => state.faculty.attendanceData?.attendance || []
  );
  const attendanceUploaded = useSelector(
    (state) => state.faculty.attendanceUploaded
  );

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [checkedValue, setCheckedValue] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getSubject({ faculty: user.result._id }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result._id]);

  useEffect(() => {
    if (selectedSubject) {
      setLoading(true);
      dispatch(getStudentForAttendance(selectedSubject, selectedDate))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [dispatch, selectedSubject, selectedDate]);

  useEffect(() => {
    const temp = attendance.filter((a) => a.attended).map((a) => a.student);
    setCheckedValue(temp);
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
    if (!selectedSubject) return alert("Please select a subject.");
    setLoading(true);
    dispatch(markAttendance(checkedValue, selectedSubject, students)).finally(
      () => setLoading(false)
    );
  };

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
                {students.map((student, idx) => (
                  <tr
                    key={student._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="border p-2 text-center">
                      {isToday ? (
                        <input
                          type="checkbox"
                          value={student._id}
                          checked={checkedValue.includes(student._id)}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                      ) : (
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-md 
                          ${checkedValue.includes(student._id) ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                        >
                          {checkedValue.includes(student._id) ? "Present" : "Absent"}
                        </span>
                      )}
                    </td>
                    <td className="border p-2 text-center">{idx + 1}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {isToday ? (
        <button
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={uploadAttendance}
        >
          {attendance.length === 0 ? "Mark Attendance" : "Update Attendance"}
        </button>
      ) : attendance.length === 0 ? (
        <p className="mt-4 text-red-500 font-semibold">No attendance marked for this day.</p>
      ) : null}
    </div>
  );
};

export default Attendance;