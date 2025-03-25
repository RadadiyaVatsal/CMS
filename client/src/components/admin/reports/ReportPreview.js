import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAttendance,
  getTestResult,
} from "../../../redux/actions/studentActions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../utils/slicaLogo.jpg"; 

const ReportPreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const attendance = useSelector((state) => state.student?.attendance);
  const testResult = useSelector((state) => state.student?.testResult);
  const printRef = useRef();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/student/getStudent/${id}`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user"))?.token
              }`,
            },
          }
        );
        setStudent(res.data);
      } catch (error) {
        console.error("Error fetching student:", error.response?.data || error);
      }
    };

    fetchStudent();
    dispatch(getAttendance(id));
    dispatch(getTestResult(id));
  }, [id, dispatch]);

  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Student_Report.pdf");
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div>
      <div
        ref={printRef}
        className="container mx-auto p-6 bg-white shadow-md rounded-lg w-10/12 mt-10 mb-10"
      >
        {/* Header with Logo and Institute Info */}
        <div className="flex items-center justify-between border-b pb-4">
          <img src={logo} alt="Institute Logo" className="w-32 h-auto" />
          <div className="text-center">
            <h1 className="text-2xl font-bold">SOM-LALIT INSTITUTE OF COMPUTER APPLICATIONS</h1>
            <p className="text-gray-600 italic">(Affiliated to Gujarat University)</p>
            <p className="text-gray-600">SLIMS Campus, Nr. St. Xavier’s Corner, University Road, Navrangpura, Ahmedabad - 380 009</p>
            <p className="text-gray-600">Phone: 26303301-2-3 | Email: somlalit@somlalit.org | Website: www.somlalit.org</p>
          </div>
        </div>
        
        {/* Student Details */}
        <div className="border-b pb-4 mt-4">
          <h2 className="text-xl font-bold">Student Information</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Username:</strong> {student?.username}</p>
            <p><strong>Batch:</strong> {student?.batch.startYear}-{student?.batch.endYear}</p>
            <p><strong>Department:</strong> {student?.department}</p>
            <p><strong>Semester:</strong> {student?.semester}</p>
            <p><strong>Email:</strong> {student?.email}</p>
            <p><strong>Contact:</strong> {student?.contactNumber}</p>
            <p><strong>DOB:</strong> {student?.dob}</p>
            <p><strong>Gender:</strong> {student?.gender}</p>
            <p><strong>Father’s Name:</strong> {student?.fatherName}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <h3 className="text-lg font-semibold mt-6 border-b pb-2">Attendance</h3>
        {attendance && attendance.attendedLec ? (
          <table className="w-full border-collapse border mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Attended Lectures</th>
                <th className="border p-2">Total Lectures</th>
                <th className="border p-2">Attendance (%)</th>
              </tr>
            </thead>
            <tbody>
              {attendance.result.map((subjectData, index) => (
                <tr key={index}>
                  <td className="border p-2">{subjectData.subject}</td>
                  <td className="border p-2">{subjectData.attended}</td>
                  <td className="border p-2">{subjectData.total}</td>
                  <td className="border p-2">
                    {((subjectData.attended / subjectData.total) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Attendance Data Available</p>
        )}

        {/* Test Results Table */}
        <h3 className="text-lg font-semibold mt-6 border-b pb-2">Test Results</h3>
        <table className="w-full border-collapse border mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Subject</th>
              <th className="border p-2">Test</th>
              <th className="border p-2">Marks</th>
              <th className="border p-2">Total Marks</th>
              <th className="border p-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {testResult?.map((test, index) => (
              <tr key={index}>
                <td className="border p-2">{test.subjectName}</td>
                <td className="border p-2">{test.test}</td>
                <td className="border p-2">{test.marks}</td>
                <td className="border p-2">{test.totalMarks}</td>
                <td className="border p-2">
                  {((test.marks / test.totalMarks) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default ReportPreview;