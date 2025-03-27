import React, { useState } from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import { Avatar } from "@mui/material";
import Data from "./Data";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: user.result.name,
    contactNumber: user.result.contactNumber,
  });

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save updated name and contact number to localStorage (Replace with API call if needed)
    const updatedUser = { 
      ...user, 
      result: { 
        ...user.result, 
        name: updatedData.name, 
        contactNumber: updatedData.contactNumber 
      } 
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Disable editing mode
    setEditable(false);
    alert("Profile updated successfully! Refresh to see changes.");
  };

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <AssignmentIndIcon />
            <h1>Profile</h1>
          </div>
          <div
            onClick={() => setEditable(!editable)}
            className="flex space-x-2 cursor-pointer"
          >
            <SecurityUpdateIcon />
            <h1 className="font-bold">{editable ? "Cancel" : "Update"}</h1>
          </div>
        </div>
        <div className="w-[98%] bg-white relative rounded-xl ">
          <div className="absolute left-[50%] top-[-10%]">
            <Avatar src={user.result.avatar} sx={{ width: 70, height: 70 }} />
          </div>
          <div className="flex py-10 ml-10 space-x-40">
            <div className="flex flex-col space-y-10">
              <Data
                label="Name"
                value={
                  editable ? (
                    <input
                      type="text"
                      name="name"
                      value={updatedData.name}
                      onChange={handleChange}
                      className="border p-2 rounded"
                    />
                  ) : (
                    user.result.name
                  )
                }
              />
              <Data label="Email" value={user.result.email} />
              <Data label="Username" value={user.result.username} />
              <Data label="Department" value={user.result.department} />
            </div>
            <div className="flex flex-col space-y-10">
              <Data label="DOB" value={user.result.dob} />
              <Data label="Joining Year" value={user.result.joiningYear} />
              <Data
                label="Contact Number"
                value={
                  editable ? (
                    <input
                      type="text"
                      name="contactNumber"
                      value={updatedData.contactNumber}
                      onChange={handleChange}
                      className="border p-2 rounded"
                    />
                  ) : (
                    user.result.contactNumber
                  )
                }
              />
            </div>
          </div>
          {editable && (
            <div className="flex justify-center p-4 space-x-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => navigate("/admin/update/password")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
