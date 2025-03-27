import React, { useEffect, useState } from "react";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";
import { updateFaculty } from "../../../../redux/actions/facultyActions";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../../utils/Spinner";
import { SET_ERRORS } from "../../../../redux/actionTypes";
import * as classes from "../../../../utils/styles";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: user?.result?.name || "",
    dob: user?.result?.dob || "",
    contactNumber: user?.result?.contactNumber || "",
    avatar: user?.result?.avatar || "",
    designation: user?.result?.designation || "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
    }
  }, [store.errors]);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
  
    const updatedData = {
      ...value,
      email: user?.result?.email, // Include email in the request
    };
  
    dispatch(updateFaculty(updatedData));
    setLoading(false);
    alert("Kindly login again to see updates");
  };
  

  useEffect(() => {
    if (store.errors || store.faculty.updatedFaculty) {
      setLoading(false);
    }
  }, [store.errors, store.faculty.updatedFaculty]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <SecurityUpdateIcon />
            <h1>Update</h1>
          </div>
          <div onClick={() => navigate("/faculty/update/password")} className="flex space-x-2 cursor-pointer">
            <VisibilityOffIcon />
            <h1 className="font-bold">Password</h1>
          </div>
        </div>

        <div className="mr-10 bg-white flex flex-col rounded-xl">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>
                  <input
                    className={classes.adminInput}
                    type="text"
                    name="name"
                    value={value.name}
                    onChange={handleChange}
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>
                  <input
                    className={classes.adminInput}
                    type="date"
                    name="dob"
                    value={value.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Email :</h1>
                  <p className="p-2 border rounded bg-gray-100">{user?.result?.email}</p>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Designation :</h1>
                  <input
                    className={classes.adminInput}
                    type="text"
                    name="designation"
                    value={value.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={classes.adminForm2r}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Department :</h1>
                  <p className="p-2 border rounded bg-gray-100">{user?.result?.department}</p>
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Contact Number :</h1>
                  <input
                    className={classes.adminInput}
                    type="text"
                    name="contactNumber"
                    value={value.contactNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Avatar :</h1>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) => setValue({ ...value, avatar: base64 })}
                  />
                </div>
              </div>
            </div>

            <div className={classes.adminFormButton}>
              <button className={classes.adminFormSubmitButton} type="submit">
                Submit
              </button>
              <button onClick={() => navigate("/faculty/profile")} className={classes.adminFormClearButton} type="button">
                Cancel
              </button>
            </div>

            <div className={classes.loadingAndError}>
              {loading && <Spinner message="Updating" height={30} width={150} color="#111111" messageColor="blue" />}
              {error.backendError && <p className="text-red-500">{error.backendError}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
