import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { addSubject, getAllBatch, getAllDepartment, getFaculty } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import { ADD_SUBJECT, SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const batches = useSelector((state) => state.admin.allBatch);
  const allFaculty = useSelector((state) => state.admin.faculties);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    subjectName: "",
    subjectCode: "",
    semester: "",
    totalLectures: "",
    department: "",
    batch: "",
    faculty: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors); // Capture errors from Redux store
    }
  }, [store.errors]);

  useEffect(() => {
    dispatch(getAllDepartment());
    dispatch(getAllBatch());
    dispatch(getFaculty(value.department));
  }, [dispatch]);

  useEffect(() => {
    if (store.errors || store.admin.subjectAdded) {
      setLoading(false);
      if (store.admin.subjectAdded) {
        setValue({
          subjectName: "",
          subjectCode: "",
          semester: "",
          totalLectures: "",
          department: "",
          batch: "",
          faculty: "",
        });

        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_SUBJECT, payload: false });
      }
    }
  }, [store.errors, store.admin.subjectAdded, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addSubject(value));
  };

  useEffect(() => {
    // Optional: Log or debug the `allFaculty` state
    console.log("Faculty data updated:", allFaculty);
  }, [allFaculty]);
 
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      department: selectedDepartment,
      faculty: "", // Reset faculty selection
    }));
  
    // Dispatch the action to fetch faculty
    dispatch(getFaculty({ department: selectedDepartment }));
  };
  
  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Add Subject</h1>
        </div>
        <div className="mr-10 bg-white flex flex-col rounded-xl">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Name :</h1>
                  <input
                    placeholder="Subject Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.subjectName}
                    onChange={(e) =>
                      setValue({ ...value, subjectName: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Subject Code :</h1>
                  <input
                    required
                    placeholder="Subject Code"
                    className={classes.adminInput}
                    type="text"
                    value={value.subjectCode}
                    onChange={(e) =>
                      setValue({ ...value, subjectCode: e.target.value })
                    }
                  />
                </div>
                {error.subjectCode && (
                  <p className="text-red-500">{error.subjectCode}</p>
                )}
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Semester :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.semester}
                    onChange={(e) =>
                      setValue({ ...value, semester: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {[...Array(8)].map((_, idx) => (
                      <MenuItem key={idx + 1} value={idx + 1}>
                        {idx + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Total Lectures :</h1>
                  <input
                    required
                    placeholder="Total Lectures"
                    className={classes.adminInput}
                    type="number"
                    value={value.totalLectures}
                    onChange={(e) =>
                      setValue({ ...value, totalLectures: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.department}
                    onChange={handleDepartmentChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {departments?.map((dp, idx) => (
                      <MenuItem key={idx} value={dp.department}>
                        {dp.department}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Batch :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.batch}
                    onChange={(e) =>
                      setValue({ ...value, batch: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {batches?.map((batch, idx) => (
                      <MenuItem key={idx} value={batch._id}>
                        {batch.startYear} - {batch.endYear}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Faculty :</h1>
                  <Select
                    required
                    displayEmpty
                    sx={{ height: 36 }}
                    inputProps={{ "aria-label": "Without label" }}
                    value={value.faculty}
                    onChange={(e) =>
                      setValue({ ...value, faculty: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {allFaculty?.map((faculty, idx) => (
                      <MenuItem key={idx} value={faculty._id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                    subjectName: "",
                    subjectCode: "",
                    semester: "",
                    totalLectures: "",
                    department: "",
                    batch: "",
                    faculty: "",
                  });
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button"
              >
                Clear
              </button>
            </div>
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Adding Subject"
                  height={30}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
              {(error.subjectError || error.backendError) && (
                <p className="text-red-500">
                  {error.subjectError || error.backendError}
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
