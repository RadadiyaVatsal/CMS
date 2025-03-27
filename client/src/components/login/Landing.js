import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import slicaLogo from "../../utils/Somlalit_Clg_Logo.jpg"; // Ensure correct path
import "animate.css"; // Using Animate.css for smooth animations

const Landing = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    setTimeout(() => {
      setShowContent(true);
    }, 500); // Delay content appearance
  }, []);

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Logo Section */}
      <div className="w-2/5 h-full flex items-center justify-center bg-gray-200 animate__animated animate__fadeInLeft">
        <img src={slicaLogo} alt="SLICA Logo" className="w-full h-full object-cover rounded-xl shadow-lg" />
      </div>

      {/* Content Section */}
      <div className={`w-3/5 p-12 flex flex-col justify-center bg-white shadow-xl rounded-lg transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 animate__animated animate__fadeInDown">
          Som-Lalit Institute of Computer Applications
        </h1>
        <p className="text-lg text-gray-600 text-justify mb-6 animate__animated animate__fadeInUp animate__delay-1s">
          <strong>Note:</strong> This website is for <span className="text-red-500 font-semibold">internal use only</span>. Unauthorized access is prohibited.
        </p>
        <div className="p-6 bg-gray-50 shadow-md rounded-lg animate__animated animate__fadeInUp animate__delay-2s">
          <ul className="space-y-3 text-gray-700 text-lg">
            <li><strong>SLIMS:</strong> 2-year MBA (Master in Business Administration) approved by AICTE and affiliated to GTU.</li>
            <li><strong>SLICA:</strong> 3-year BCA (Bachelor in Computer Application).</li>
            <li><strong>SLIBA:</strong> 3-year BBA (Bachelor in Business Administration).</li>
            <li><strong>SLCC:</strong> 3-year B.Com (Bachelor in Commerce).</li>
          </ul>
        </div>
        
        {/* Student Login Button */}
        <div className="mt-6 flex justify-center animate__animated animate__zoomIn animate__delay-3s">
          <button
            className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
            onClick={() => navigate("/login/studentlogin")} // Navigate on button click
          >
            Student Login
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center text-gray-600 animate__animated animate__fadeIn animate__delay-4s">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-lg">📞 26303301-2-3</p>
          <p className="text-lg">📧 somlalit@somlalit.org</p>
          <p className="mt-2 text-gray-500">SLIMS Campus, Nr. St. Xavier’s Corner, University Road, Navrangpura, Ahmedabad-380 009</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
