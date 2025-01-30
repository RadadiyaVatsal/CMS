import React, { useEffect, useState, useRef } from "react";
import BoyIcon from "@mui/icons-material/Boy";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentForAttendance,
  markAttendance,
  updateAttendance,
} from "../../../redux/actions/facultyActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { ATTENDANCE_MARKED, SET_ERRORS } from "../../../redux/actionTypes";
import { getSubject } from "../../../redux/actions/facultyActions";

const Body = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects?.result || []);
  const students = useSelector((state) => state.admin.students);
  const errors = useSelector((state) => state.errors);
  let attendance = useSelector((state) => state.faculty.attendance.alreadyAdded);

  const attendanceUploaded = useSelector(
    (state) => state.faculty.attendanceUploaded
  );

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ subject: "" });
  const [checkedValue, setCheckedValue] = useState([]);
  const [search, setSearch] = useState(false);
  const inputRef = useRef([]);
  let addedStudents = [];

  useEffect(() => {
    setTimeout(() => {
      attendance?.forEach((a, idx) => {
        if (inputRef.current[idx]) {
          inputRef.current[idx].checked = a.attended;
          if (a.attended) {
            setCheckedValue((prev) => [...prev, a.student]);
          }
          setLoading(false);
        }
      });
    }, 0);
  }, [attendance]);

  useEffect(() => {
    // Fetch subjects for the logged-in faculty
    dispatch(getSubject({ faculty: user.result._id }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result._id]);

  useEffect(() => {
    if (attendanceUploaded) {
      setValue({ subject: "" });
      setCheckedValue([]);
      setSearch(false);
      dispatch({ type: ATTENDANCE_MARKED, payload: false });
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [attendanceUploaded, dispatch]);

  // const handleInputChange = (e) => {
  //   const studentId = e.target.value;
  //   if (attendance.length == 0) {
  //     setCheckedValue((prev) =>
  //       e.target.checked
  //         ? [...prev, studentId]
  //         : prev.filter((id) => id !== studentId)
  //     );
  //   } else {
  //     console.log(e.target.checked);
  //     if (!e.target.checked) {
  //       console.log(attendance)
  //       attendance = attendance.filter((item) => item !== studentId);
  //       console.log(attendance)
  //     }
  //   }
  // // };
  // const handleInputChange = (e) => {
  //   const studentId = e.target.value;
  
  //   // If the checkbox is checked
  //   if (e.target.checked) {
  //     if (!attendance.includes(studentId)) {
  //       // Add the student ID to the attendance array
  //       attendance = [...attendance, studentId];
  //     }
  //   } else {
  //     // If the checkbox is unchecked, remove the student ID from the attendance array
  //     attendance = attendance.filter((id) => id !== studentId);
  //   }
  
  //   // Update the checkedValue state
  //   setCheckedValue(attendance);
  // };
  
  const handleInputChange = (e) => {
    const studentId = e.target.value;
  
    setCheckedValue((prev) =>
      e.target.checked
        ? [...prev, studentId]
        : prev.filter((id) => id !== studentId)
    );
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.subject) {
      return alert("Please select a subject.");
    }
    setSearch(true);
    setLoading(true);
    dispatch(getStudentForAttendance(value.subject))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
    dispatch(updateAttendance(value.subject));
  };

  const uploadAttendance = () => {
    if (checkedValue.length === 0) {
      return alert("Please select at least one student.");
    }
    setLoading(true);
    dispatch(
      markAttendance(checkedValue, value.subject, students)
    ).finally(() => setLoading(false));
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
            <label htmlFor="subject">Subject</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.subject}
              onChange={(e) => setValue({ ...value, subject: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subjectName}
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
              {errors.noStudentError || errors.backendError || errors.message ? (
                <p className="text-red-500 text-2xl font-bold">
                  {errors.noStudentError || errors.backendError || errors.message}
                </p>
              ) : null}
            </div>
            {search && !loading && students.length > 0 && (
              <div className={`${classes.adminData} h-[20rem]`}>
                <div className="grid grid-cols-7">
                  <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                    Select
                  </h1>
                  <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                    Sr. No.
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                    Name
                  </h1>
                  <h1 className={`col-span-2 ${classes.adminDataHeading}`}>
                    Username
                  </h1>
                  <h1 className={`col-span-1 ${classes.adminDataHeading}`}>
                   Semester   
                 </h1>
                </div>
                {students.map((student, idx) => (
                  <div
                    key={student._id}
                    className={`${classes.adminDataBody} grid-cols-7`}
                    >
                    <input
                    ref={(checkboxInput) => (inputRef.current[idx] = checkboxInput)}
                    onChange={handleInputChange}
                    value={student._id}
                    className="col-span-1 border-2 w-16 h-4 mt-3 px-2"
                    type="checkbox"
                  />

                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {idx + 1}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {student.name}
                    </h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {student.username}
                    </h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {student.semester}
                    </h1>
                  </div>
                ))}
                <button
                  className={`${classes.adminFormSubmitButton} w-56 mt-4`}
                  onClick={uploadAttendance}
                >
                  {attendance?.length == 0 ? "Mark Attendance" : "Update Attendance"}
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
