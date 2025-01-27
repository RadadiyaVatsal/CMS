import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import { getTestResult } from "../../../redux/actions/studentActions";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const testResult = useSelector((state) => state.student.testResult);
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

 

 

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
    dispatch(getSubject());
    dispatch(getTestResult({ studentId: user.result._id }));
    setLoading(false);
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <MenuBookIcon />
          <h1>All Subjects</h1>
        </div>
        <div className="bg-white h-[29.5rem] rounded-xl shadow-lg px-8 py-6">
          <div className="col-span-3">
            <div>
              {loading && (
                <Spinner
                  message="Loading"
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {error.notestError && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.notestError}
                </p>
              )}
              {!loading &&(
                  <div>
                    <div className="grid grid-cols-8 text-gray-600 font-semibold mb-4 border-b pb-2">
                      <h1 className="col-span-1 text-center">Sr No.</h1>
                      <h1 className="col-span-1 text-center">Subject Code</h1>
                      <h1 className="col-span-2 text-center">Subject Name</h1>
                      <h1 className="col-span-2 text-center">Test</h1>
                      <h1 className="col-span-1 text-center">Marks</h1>
                      <h1 className="col-span-1 text-center">Total Marks</h1>
                    </div>
                    <div className="space-y-2">
                      {testResult?.map((res, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-8 items-center bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm py-2 px-4">
                          <h1 className="col-span-1 text-center text-gray-800">
                            {idx + 1}
                          </h1>
                          <h1 className="col-span-1 text-center text-gray-800">
                            {res.subjectCode}
                          </h1>
                          <h1 className="col-span-2 text-center text-gray-800">
                            {res.subjectName}
                          </h1>
                          <h1 className="col-span-2 text-center text-gray-800">
                            {res.test}
                          </h1>
                          <h1 className="col-span-1 text-center text-gray-800">
                            {res.marks}
                          </h1>
                          <h1 className="col-span-1 text-center text-gray-800">
                            {res.totalMarks}
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
