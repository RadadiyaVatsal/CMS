import React from "react";
import slicaLogo from "../../utils/Somlalit_Clg_Logo.jpg"; // Ensure correct path

const Landing = () => {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* Logo Section */}
      <div style={{ width: "60%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e5e7eb" }}>
        <img src={slicaLogo} alt="SLICA Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      
      {/* Content Section */}
      <div style={{ width: "100%", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(to right, #ffffff, #f3f4f6)", boxShadow: "5px 5px 15px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem", textAlign: "center" }}>
          Som-Lalit Education and Research Foundation
        </h1>
        <p style={{ fontSize: "1.125rem", color: "#374151", lineHeight: "1.75rem", textAlign: "justify" }}>
          Som-Lalit Education and Research Foundation is a trust registered under the Societies Act. The academic activities under the aegis of this Trust commenced from August 12, 1996. At present, the following programs are offered by various institutes of this Trust:
        </p>
        <ul style={{ marginTop: "1.5rem", listStyleType: "none", paddingLeft: "0", color: "#374151", fontSize: "1.125rem", lineHeight: "1.75rem" }}>
          <li><strong>SLIMS:</strong> 2-year MBA (Master in Business Administration) approved by AICTE and affiliated to GTU.</li>
          <li><strong>SLICA:</strong> 3-year BCA (Bachelor in Computer Application).</li>
          <li><strong>SLIBA:</strong> 3-year BBA (Bachelor in Business Administration).</li>
          <li><strong>SLCC:</strong> 3-year B.Com (Bachelor in Commerce).</li>
        </ul>
      </div>
    </div>
  );
};

export default Landing;
