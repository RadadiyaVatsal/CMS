import {
  ADD_TEST,
  ATTENDANCE_MARKED,
  FACULTY_LOGIN,
  GET_SUBJECT,
  GET_TEST,
  LOGOUT,
  MARKS_UPLOADED,
  UPDATE_ATTENDANCE,
  UPDATE_FACULTY,
  UPDATE_PASSWORD,
  GET_STUDENT_FOR_ATTENDANCE,
  DELETE_FILE,
  UPLOAD_FILE,
  FETCH_FILE
} from "../actionTypes";

const initialState = {
  authData: null,
  updatedPassword: false,
  updatedFaculty: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  tests: [],
  subjects: [],
  attendance: [],
  attendanceData: {},
  files: [], // File management state
  error: null 
};

const facultyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FACULTY_LOGIN:
      localStorage.setItem("user", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };

    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };

    case UPDATE_PASSWORD:
      return { ...state, updatedPassword: action.payload };

    case UPDATE_FACULTY:
      return { ...state, updatedFaculty: action.payload };

    case UPDATE_ATTENDANCE:
      return { ...state, attendance: action.payload };

    case ADD_TEST:
      return { ...state, testAdded: action.payload };

    case GET_SUBJECT:
      return { ...state, subjects: action.payload };

    case GET_TEST:
      return { ...state, tests: action.payload };

    case MARKS_UPLOADED:
      return { ...state, marksUploaded: action.payload };

    case ATTENDANCE_MARKED:
      return { ...state, attendanceUploaded: action.payload };

    case GET_STUDENT_FOR_ATTENDANCE:
      return { ...state, attendanceData: action.payload };

    // File Management Actions
    case FETCH_FILE:
      return { ...state, files: action.payload, error: null };

    case UPLOAD_FILE:
      return { ...state, files: [...state.files, action.payload], error: null };

    case DELETE_FILE:
      return {
        ...state,
        files: state.files.filter((file) => file._id !== action.payload),
        error: null,
      };

    default:
      return state;
  }
};

export default facultyReducer;
