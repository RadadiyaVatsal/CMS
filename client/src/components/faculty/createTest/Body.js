import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { createTest, getSubject } from "../../../redux/actions/facultyActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_TEST, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    test: "",
    totalMarks: "",
    date: "",
    subject :"",
  });
  const subjects = useSelector((state) => state.faculty.subjects.result);

  useEffect(() => {
    dispatch(getSubject({faculty: user.result._id}))
  }, [])

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({
          test: "",
        totalMarks: "",
        date: "",
       subject : "",
      });
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(createTest(value));
    setLoading(false);
    
    setValue({
      test: "",
      totalMarks: "",
      date: "",
      subject : "",
    });
  };

  useEffect(() => {
    if (store.errors || store.faculty.testAdded) {
      setLoading(false);
      if (store.faculty.testAdded) {
        setValue({
          test: "",
          totalMarks: "",
          date: "",
          subject : "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_TEST, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.faculty.testAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Create Test</h1>
        </div>
        <div className=" mr-10 bg-white flex flex-col rounded-xl ">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Test Name :</h1>

                  <input
                    placeholder="Test Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.test}
                    onChange={(e) =>
                      setValue({ ...value, test: e.target.value })
                    }
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.subject}
                    onChange={(e) =>
                      setValue({ ...value, subject: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {subjects?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.subjectCode}>
                        {dp.subjectName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

            
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Total Marks :</h1>

                  <input
                    required
                    placeholder="Total Marks"
                    className={classes.adminInput}
                    type="number"
                    value={value.totalMarks}
                    onChange={(e) =>
                      setValue({ ...value, totalMarks: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Date :</h1>

                  <input
                    required
                    className={classes.adminInput}
                    type="date"
                    value={value.date}
                    onChange={(e) =>
                      setValue({ ...value, date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button
                onClick={() => {
                  setValue({
                    test: "",
                    totalMarks: "",
                    date: "",
                    subject: "",
                  });
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button">
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Creating Test"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.testError || error.backendError) && (
                <p className="text-red-500">
                  {error.testError || error.backendError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
