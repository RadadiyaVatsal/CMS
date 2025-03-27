import React, { useEffect, useState } from "react";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import FileBase from "react-file-base64";
import { useDispatch } from "react-redux";
import { updateStudent } from "../../../redux/actions/studentActions";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Body = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState({
    name: "",
    dob: "",
    email: "",
    contactNumber: "",
    fatherName: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/student/getStudent/${user.result._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setStudent(res.data);
      } catch (error) {
        console.error("Error fetching student:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [user.result._id, user.token]);

  useEffect(() => {
    if (student) {
      setValue({
        name: student.name || "",
        dob: student.dob || "",
        email: student.email || "",
        contactNumber: student.contactNumber || "",
        fatherName: student.fatherName || "",
        avatar: student.avatar || "",
      });
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!value.name && !value.dob && !value.contactNumber && !value.fatherName && !value.avatar) {
      alert("Enter at least one value");
      setLoading(false);
    } else {
      dispatch(updateStudent(value));
      alert("Kindly login again to see updates");
    }
  };

  if (loading) return <h1 className="text-center mt-5">Loading...</h1>;

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <SecurityUpdateIcon />
            <h1>Update Profile</h1>
          </div>
          <div
            onClick={() => navigate("/student/update/password")}
            className="flex space-x-2 cursor-pointer"
          >
            <VisibilityOffIcon />
            <h1 className="font-bold">Change Password</h1>
          </div>
        </div>

        <div className="mr-10 bg-white flex flex-col rounded-xl overflow-y-scroll h-[27rem] p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Name:</label>
                <input
                  className="w-full border p-2 rounded"
                  type="text"
                  placeholder={student?.name}
                  value={value.name}
                  onChange={(e) => setValue({ ...value, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">DOB:</label>
                <input
                  className="w-full border p-2 rounded"
                  type="date"
                  value={value.dob}
                  onChange={(e) => setValue({ ...value, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">Email:</label>
                <input className="w-full border p-2 rounded" type="text" value={value.email} disabled />
              </div>
              <div>
                <label className="block font-semibold">Father's Name:</label>
                <input
                  className="w-full border p-2 rounded"
                  type="text"
                  placeholder={student?.fatherName}
                  value={value.fatherName}
                  onChange={(e) => setValue({ ...value, fatherName: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">Contact Number:</label>
                <input
                  className="w-full border p-2 rounded"
                  type="text"
                  placeholder={student?.contactNumber}
                  value={value.contactNumber}
                  onChange={(e) => setValue({ ...value, contactNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-semibold">Avatar:</label>
                <FileBase type="file" multiple={false} onDone={({ base64 }) => setValue({ ...value, avatar: base64 })} />
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg mt-4">
              <h1 className="text-lg font-semibold">Additional Information</h1>
              <p><strong>Semester:</strong> {student?.semester}</p>
              <p><strong>Batch:</strong> {student?.batch?.startYear} - {student?.batch?.endYear}</p>
              <p><strong>Department:</strong> {student?.department}</p>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                type="submit"
              >
                Submit
              </button>
              <button
                onClick={() => navigate("/student/profile")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Body;
