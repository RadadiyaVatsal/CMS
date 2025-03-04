import React from "react";
import Body from "./Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Resources = () => {
  return (
    <div className="bg-[#d6d9e0] h-screen flex">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#f4f6fa] h-screen rounded-2xl shadow-2xl space-y-6">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <Body />
        </div>
      </div>
    </div>
  );
};

export default Resources;
