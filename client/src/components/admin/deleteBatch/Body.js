import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  getAllDepartment,
} from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import MenuItem from "@mui/material/MenuItem";
import { DELETE_BATCH, SET_ERRORS } from "../../../redux/actionTypes";
import { deleteBatch } from "../../../redux/actions/adminActions";
import { getAllBatch } from "../../../redux/actions/adminActions";


const Body = () => {
  const dispatch = useDispatch();
  const [batch, setBatch] = useState("");
  const [error, setError] = useState({});
  let batches = useSelector((state) => state.admin.allBatch);
  // const batches = useState([])


  const [loading, setLoading] = useState(false);
  const store = useSelector((state) => state);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    setLoading(true);
    setError({});
  
    // Dispatch the delete action for the selected batch
    dispatch(deleteBatch(batches[batch]))
      .then(() => {
        setLoading(false);
        setBatch(""); // Clear the selected batch
        dispatch(getAllBatch()); // Fetch updated list of batches
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };
  

  useEffect(() => {
    if (store.admin.departmentDeleted) {
      setLoading(false);
      setBatch("");
      dispatch(getAllBatch());
      dispatch({ type: DELETE_BATCH, payload: false });
    }
  }, [store.admin.batchDeleted, store.admin.allBatch]);

  useEffect(() => {
    dispatch(getAllBatch());
  }, [])


  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1>All Batches</h1>
        </div>
        <div className=" mr-10 bg-white grid grid-cols-4 rounded-xl pt-6 pl-6 h-[29.5rem]">
          <form
            className="flex flex-col space-y-2 col-span-1"
            onSubmit={handleSubmit}>
            <label htmlFor="batch">Batch</label>
            <Select
              required
              displayEmpty
              sx={{ height: 36, width: 224 }}
              inputProps={{ "aria-label": "Without label" }}
              value={batch}
              onChange={(e) => setBatch(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {batches?.map((bt, idx) => (
                <MenuItem key={idx} value={idx}>
                  {bt.startYear} - {bt.endYear}
                </MenuItem>
              ))}
            </Select>
            <button
              className={`${classes.adminFormSubmitButton} w-56`}
              type="submit">
              Delete
            </button>
          </form>
          <div className="col-span-3 mr-6">
            <div className={classes.loadingAndError}>
              {loading && (
                <Spinner
                  message="Deleting"
                  height={50}
                  width={150}
                  color="#111111"
                  messageColor="blue"
                />
              )}
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
