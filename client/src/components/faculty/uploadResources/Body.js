import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFile,
  fetchFiles,
  getSubject,
  downloadFile,
  deleteFile,
} from "../../../redux/actions/facultyActions";
import {
  MenuItem,
  Select,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { SET_ERRORS } from "../../../redux/actionTypes";
import moment from "moment";
// import faculty from "../../../../../server/models/faculty";

const FileSharing = () => {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.faculty);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin.subjects?.result || []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
  
      dispatch(fetchFiles(user.result._id ,  selectedSubject));
    
  }, [dispatch,  selectedSubject]);
  useEffect( ()=>{
    console.log(user);
    dispatch(fetchFiles(user.result._id));
  } , [])

  useEffect(() => {
    dispatch(getSubject({ faculty: user.result._id }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result._id]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedSubject) {
      alert("Please select a file and a subject.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("facultyId", user.result._id);
    formData.append("subjectId", selectedSubject);

    dispatch(uploadFile(formData));
    setSelectedFile(null);
    setShowUploadForm(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>File Sharing Module</h2>
      <Button
        variant="contained"
        color={showUploadForm ? "secondary" : "primary"}
        onClick={() => setShowUploadForm(!showUploadForm)}
      >
        {showUploadForm ? "Cancel" : "Upload File"}
      </Button>

      {showUploadForm ? (
        <div style={styles.uploadForm}>
          <label style={styles.label}>Select Subject:</label>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">None</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.subjectName}
              </MenuItem>
            ))}
          </Select>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={styles.fileInput}
          />
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      ) : (
        <>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            displayEmpty
            style={styles.selectBox}
          >
            <MenuItem value="">All Subjects</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.subjectName}
              </MenuItem>
            ))}
          </Select>

          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>File Name</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Upload Date</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Download</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Delete</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : files?.length > 0 ? (
                  files
                    .filter((file) => file.uploadedBy === user.result._id) // ✅ Only show files uploaded by this user
                    .map((file) => (
                      <TableRow key={file._id}>
                        <TableCell>{file.originalname}</TableCell>
                        <TableCell align="right">
                          {moment(file.uploadDate).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              dispatch(
                                downloadFile(file._id, file.originalname)
                              )
                            }
                          >
                            Download
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => dispatch(deleteFile(file._id))}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No files available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    margin: "20px auto",
    width: "90%",
    height: "500px",
    maxWidth: "1200px",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
  },
  selectBox: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "40%",
    margin: "0px 0px 0px 120px",
  },
  fileInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  tableContainer: {
    marginTop: "20px",
    height: "310px",
    overflowY: "auto",
  },
};

export default FileSharing;
