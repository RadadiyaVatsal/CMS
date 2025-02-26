import React, { useEffect, useState } from "react";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addAdmin } from "../../../redux/actions/adminActions";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "../../../utils/Spinner";
import * as classes from "../../../utils/styles";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    joiningYear: Date().split(" ")[3],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue({ ...value, email: "" });
    }
  }, [store.errors]);

  useEffect(() => {
    if (store.admin.adminAdded) {
      navigate("/admin/deleteadmin");
    }
  }, [store.admin.adminAdded, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addAdmin(value));
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex text-gray-400 items-center space-x-2">
          <EngineeringIcon />
          <h1>Add Admin</h1>
        </div>
        <div className="mr-10 bg-white flex flex-col rounded-xl">
          <form className={classes.adminForm0} onSubmit={handleSubmit}>
            <div className={classes.adminForm1}>
              <div className={classes.adminForm2l}>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>Name :</h1>
                  <input
                    placeholder="Full Name"
                    required
                    className={classes.adminInput}
                    type="text"
                    value={value.name}
                    onChange={(e) =>
                      setValue({ ...value, name: e.target.value })
                    }
                  />
                </div>
                <div className={classes.adminForm3}>
                  <h1 className={classes.adminLabel}>DOB :</h1>
                  <input
                    placeholder="DD/MM/YYYY"
                    className={classes.adminInput}
                    required
                    type="date"
                    value={value.dob}
                    onChange={(e) =>
                      setValue({ ...value, dob: e.target.value })
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
                    name: "",
                    dob: "",
                    email: "",
                    department: "",
                    contactNumber: "",
                    avatar: "",
                    joiningYear: Date().split(" ")[3],
                  });
                  setError({});
                }}
                className={classes.adminFormClearButton}
                type="button">
                Clear
              </button>
              <button
                onClick={() => navigate("/admin/deleteadmin")}
                className={classes.adminFormClearButton}
                type="button">
                Back
              </button>
            </div>
            {loading && (
              <Spinner
                message="Adding Admin"
                height={30}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
