import React from "react";
import { deleteNotice, getNotice } from "../../redux/actions/adminActions";
import { useDispatch } from "react-redux";

const Notice = ({ notice, notFor, setOpen }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are You Sure? You Want To Delete Notice")) return;

    try {
      // Delete the notice
      await dispatch(deleteNotice({ notice: notice._id }));
      // Fetch the updated list of notices
      await dispatch(getNotice());
      // Close the notice view
      setOpen(false);
    } catch (error) {
      alert("Failed to delete notice", error);
    }
  };

  return (
    notFor !== notice.noticeFor && (
      <div className="flex shadow-md py-2 px-2 rounded-lg bg-slate-50 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer h-10">
        ⚫
        <h1 className="font-bold ml-3 overflow-hidden text-ellipsis w-[15rem]">
          {notice.topic}
        </h1>
        <p className="text-ellipsis w-[25rem] overflow-hidden">
          {notice.content}
        </p>

        <button
          className="flex items-center px-4 py-2 bg-red-500 text-white font-medium text-sm rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-1 14H6L5 7m5 0V4h4v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    )
  );
};

export default Notice;
