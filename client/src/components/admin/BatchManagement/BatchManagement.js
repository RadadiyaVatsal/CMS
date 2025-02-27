import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Body from "./Body";
import AddBatch from "../addBatch/AddBatch";

const BatchManagement = () => {
  const [showAddBatch, setShowAddBatch] = useState(false);

  return (
    <div className="bg-[#d6d9e0] h-screen flex items-center justify-center">
      <div className="flex flex-col bg-[#f4f6fa] h-5/6 w-[95%] rounded-2xl shadow-2xl space-y-6 overflow-hidden">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar Section */}
          <div className="w-1/5 min-w-[200px]">
            <Sidebar />
          </div>
 
          {/* Body Section */}
          <div className="flex-1">
           <Body/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
