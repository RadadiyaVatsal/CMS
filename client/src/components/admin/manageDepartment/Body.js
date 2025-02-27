import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { addDepartment, getAllDepartment, deleteDepartment } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import { ADD_DEPARTMENT, SET_ERRORS, DELETE_DEPARTMENT } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";

const Body = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState({});
  const [showForm, setShowForm] = useState(false);
  const departments = useSelector((state) => state.admin.allDepartment);
  const store = useSelector((state) => state);

  useEffect(() => {
    dispatch(getAllDepartment()); // Fetch all departments when the component loads
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.admin.departmentAdded || store.admin.departmentDeleted) {
      setLoading(false);
      setDepartment("");
      dispatch(getAllDepartment()); // Refresh department list after add/delete
      dispatch({ type: ADD_DEPARTMENT, payload: false });
      dispatch({ type: DELETE_DEPARTMENT, payload: false });
      dispatch({ type: SET_ERRORS, payload: {} });
    }
  }, [store.admin.departmentAdded, store.admin.departmentDeleted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(addDepartment({ department }));
  };

  const handleDelete = (deptName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the department "${deptName}"?`);
    if (!confirmDelete) return;
    setLoading(true);
    dispatch(deleteDepartment({ department: deptName }));
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <AddIcon />
          <h1>Department Management</h1>
        </div>

        {/* Button to Show Form */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Close" : "Add New Department"}
        </button>

        {/* Add Department Form (Shown When Button Clicked) */}
        {showForm && (
          <div className="mr-10 bg-white flex flex-col rounded-xl p-5 shadow-md">
            <form className={classes.adminForm0} onSubmit={handleSubmit}>
              <div className="flex space-x-5 items-center">
                <label className={classes.adminLabel}>Department:</label>
                <input
                  placeholder="Enter Department"
                  required
                  className={classes.adminInput}
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className={classes.adminFormButton}>
                <button className={classes.adminFormSubmitButton} type="submit">Submit</button>
                <button onClick={() => setDepartment("")} className={classes.adminFormClearButton} type="button">Clear</button>
              </div>
              <div className={classes.loadingAndError}>
                {loading && <Spinner message="Processing..." height={30} width={150} color="#111" />}
                {(error.departmentError || error.backendError) && (
                  <p className="text-red-500">{error.departmentError || error.backendError}</p>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Department Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-3">Existing Departments</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Department Name</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept._id} className="border-t">
                    <td className="px-4 py-2">{dept.department}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(dept.department)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-gray-500 py-3">No departments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Body;