import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; // Create Notice
import GroupIcon from "@mui/icons-material/Group"; // Manage Batch
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; // Manage Admin
import ApartmentIcon from "@mui/icons-material/Apartment"; // Manage Department
import SchoolIcon from "@mui/icons-material/School"; // Manage Faculty
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // Manage Students
import MenuBookIcon from "@mui/icons-material/MenuBook"; // Manage Subjects
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";
const isActiveStyle =
  "flex items-center px-5 gap-3 text-blue-600 transition-all duration-200 ease-in-out capitalize hover:bg-gray-200 py-2 my-1";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    alert("OOPS! Your session expired. Please Login again");
    dispatch({ type: "LOGOUT" });
    navigate("/login/adminLogin");
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    setUser(JSON.parse(localStorage.getItem("admin")));
  }, [navigate]);

  return (
    <div className="flex-[0.2]">
      <div className="space-y-8 overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-gray-300 h-[33rem]">
        <div>
          <NavLink
            to="/admin/home"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <HomeIcon />
            <h1 className="font-normal">Dashboard</h1>
          </NavLink>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AccountCircleIcon />
            <h1 className="font-normal">Profile</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/createNotice"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <NotificationsActiveIcon />
            <h1 className="font-normal">Create Notice</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/manage-batch"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <GroupIcon />
            <h1 className="font-normal">Manage Batch</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/manageadmin"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <AdminPanelSettingsIcon />
            <h1 className="font-normal">Manage Admin</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/managedepartment"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <ApartmentIcon />
            <h1 className="font-normal">Manage Department</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/managefaculty"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <SchoolIcon />
            <h1 className="font-normal">Manage Faculty</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/managestudent"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <PeopleAltIcon />
            <h1 className="font-normal">Manage Students</h1>
          </NavLink>
        </div>

        <div>
          <NavLink
            to="/admin/managesubject"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <MenuBookIcon />
            <h1 className="font-normal">Manage Subjects</h1>
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }>
            <MenuBookIcon />
            <h1 className="font-normal">Reports</h1>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
