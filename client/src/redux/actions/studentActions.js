import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
  FETCH_FILE
} from "../actionTypes";
import * as api from "../api";

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/student/home");
    else navigate("/student/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTestResult =
  (studentId) => async (dispatch) => {
    try {
      const { data } = await api.getTestResult(studentId);
      dispatch({ type: TEST_RESULT, payload: data.answer });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getAttendance =
  (studentId) => async (dispatch) => {
    try {
      const { data } = await api.getAttendance({studentId});
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

  export const fetchFiles = ( subjectId = "") => async (dispatch) => {
    try {
      console.log("Fetching files for:", {  subjectId }); // 
      const { data } = await api.getResources( subjectId); // Pass facultyId & subjectId
      console.log("Here in redux" , data);
      dispatch({ type: FETCH_FILE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || "Fetching files failed" });
    }
  };
  
  export const downloadFile = (fileId, fileName) => async (dispatch) => {
    console.log("Inside faculty Actions");
    try {
      const response = await api.downloadResource(fileId); // API call to download file
      const blob = new Blob([response.data]); // Create a blob from response data
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName); // Set file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response?.data || "File download failed" });
    }
  };
  