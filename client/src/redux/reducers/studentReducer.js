import {
  LOGOUT,
  STUDENT_LOGIN,
  UPDATE_STUDENT,
  UPDATE_PASSWORD,
  TEST_RESULT,
  ATTENDANCE,
  FETCH_FILE
} from "../actionTypes";

const initialState = {
  authData: null,
  updatedPassword: false,
  updatedStudent: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  testResult: ["something something bolo"],
  tests: [],
  attendance: [],
  resources : [],
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENT_LOGIN:
      localStorage.setItem("user", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedPassword: action.payload,
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        updatedStudent: action.payload,
      };
    case TEST_RESULT:
      return {
        ...state,
        testResult: action.payload,
      };
    case ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      }; 
      case FETCH_FILE:
            return { ...state, resources: action.payload, error: null };

    default:
      return state;
  }
};

export default studentReducer;
