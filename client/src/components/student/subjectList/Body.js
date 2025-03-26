import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects.result || []);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    console.log("Subjects from API:", subjects);
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    setLoading(true);
    dispatch(getSubject({ 
      department: user.result.department, 
      batch: user.result.batch, 
      semester: user.result.semester 
    }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result.department, user.result.batch, user.result.semester]);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>All Subjects</h1>
        </div>
        <div className="mr-10 bg-white rounded-xl pt-6 pl-6 h-[29.5rem]">
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
              {!loading && error.noSubjectError && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError}
                </p>
              )}
              {!loading && subjects?.length === 0 && (
                <p className="text-red-500 text-2xl font-bold">No subjects found</p>
              )}
            </div>
            {!loading && subjects?.length > 0 && (
              <div className={classes.adminData}>
                <div className="grid grid-cols-7">
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>Sr no.</h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2`}>Subject Code</h1>
                  <h1 className={`${classes.adminDataHeading} col-span-3`}>Subject Name</h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>Total Lectures</h1>
                </div>
                {subjects?.map((sub, idx) => (
                  <div key={idx} className={`${classes.adminDataBody} grid-cols-7`}>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>{idx + 1}</h1>
                    <h1 className={`col-span-2 ${classes.adminDataBodyFields}`}>{sub.subjectCode}</h1>
                    <h1 className={`col-span-3 ${classes.adminDataBodyFields}`}>{sub.subjectName}</h1>
                    <h1 className={`col-span-1 ${classes.adminDataBodyFields}`}>{sub.totalLectures}</h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
