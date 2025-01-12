import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import { getAllBatch, getSubject } from "../../../redux/actions/adminActions";
import { MenuItem, Select } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const departments = useSelector((state) => state.admin.allDepartment);
  const batches = useSelector((state) => state.admin.allBatch);
  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);
  const [value, setValue] = useState({
    department: "",
    semester: "",
    batch: "",
  });
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    setLoading(true);
    setError({});
    dispatch(getSubject(value));
  };

  const subjects = useSelector((state) => state.admin.subjects.result);

  useEffect(() => {
    if (subjects?.length !== 0) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);
  
  useEffect(() => {
    dispatch(getAllBatch());
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <MenuBookIcon />
          <h1>All Subjects</h1>
        </div>
        <div className="mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}>
            <label htmlFor="department">Department</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.department}
              onChange={(e) =>
                setValue({ ...value, department: e.target.value })
              }>
              <MenuItem value="">None</MenuItem>
              {departments?.map((dp, idx) => (
                <MenuItem key={idx} value={dp.department}>
                  {dp.department}
                </MenuItem>
              ))}
            </Select>
            <label htmlFor="batches">Batch</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.batch}
              onChange={(e) => setValue({ ...value, batch: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {batches?.map((dp, idx) => (
                <MenuItem key={idx} value={dp._id}>
                  {dp.startYear} - {dp.endYear}
                </MenuItem>
              ))}
            </Select>
            <label htmlFor="semester">Semester</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={value.semester}
              onChange={(e) =>
                setValue({ ...value, semester: e.target.value })
              }>
              <MenuItem value="">None</MenuItem>
              {[...Array(8)].map((_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit">
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
              {(error.noSubjectError || error.backendError) && (
                <p className="text-red-500 text-2xl font-bold">
                  {error.noSubjectError || error.backendError}
                </p>
              )}
            </div>
            {search &&
              !loading &&
              Object.keys(error).length === 0 &&
              subjects?.length !== 0 && (
                <table className="w-full table-auto border-collapse border border-gray-200 mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Sr. No.</th>
                      <th className="border border-gray-300 px-4 py-2">Subject Code</th>
                      <th className="border border-gray-300 px-4 py-2">Subject Name</th>
                      <th className="border border-gray-300 px-4 py-2">Total Lectures</th>
                      <th className="border border-gray-300 px-4 py-2">Faculty Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects?.map((sub, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                        <td className="border border-gray-300 px-4 py-2">{sub.subjectCode}</td>
                        <td className="border border-gray-300 px-4 py-2">{sub.subjectName}</td>
                        <td className="border border-gray-300 px-4 py-2">{sub.totalLectures}</td>
                        <td className="border border-gray-300 px-4 py-2">{sub.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
