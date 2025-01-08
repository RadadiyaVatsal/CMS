import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundSize: "cover",
      }}>
      <div className="flex flex-col items-center p-6 space-y-20 bg-white bg-opacity-80 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Welcome To Somlalit Institue Of Management System
        </h1>
        <div className="grid grid-cols-2 gap-16">
          <div className="h-80 w-80 p-6 shadow-lg flex flex-col items-center justify-between bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <h2 className="text-3xl font-semibold text-white">Faculty</h2>
            <Link
              to="/login/facultylogin"
              className="px-8 py-3 bg-white text-indigo-700 text-lg font-medium rounded-lg hover:bg-indigo-200 transition-transform transform hover:scale-105">
              Login
            </Link>
          </div>
          <div className="h-80 w-80 p-6 shadow-lg flex flex-col items-center justify-between bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <h2 className="text-3xl font-semibold text-white">Student</h2>
            <Link
              to="/login/studentlogin"
              className="px-8 py-3 bg-white text-pink-700 text-lg font-medium rounded-lg hover:bg-pink-200 transition-transform transform hover:scale-105">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
