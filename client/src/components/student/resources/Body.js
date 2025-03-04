import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadFile, fetchFiles } from "../../../redux/actions/studentActions";
import { getSubject } from "../../../redux/actions/adminActions";
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

const Body = () => {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.faculty);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjects = useSelector((state) => state.admin?.subjects?.result || []);
  
  const [selectedSubject, setSelectedSubject] = useState("");

  // Fetch student subjects
  useEffect(() => {
    dispatch(getSubject({ department: user.result.department, batch: user.result.batch, semester: user.result.semester }));
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch, user.result.department, user.result.batch, user.result.semester]);

  // Fetch files when subject changes
  useEffect(() => {
    dispatch(fetchFiles(selectedSubject));
  }, [dispatch, selectedSubject]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>File Sharing Module</h2>

      {/* Subject Selection */}
      <Select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        displayEmpty
        style={styles.selectBox}
      >
        <MenuItem value="">All Subjects</MenuItem>
        {subjects?.map((subject) => (
          <MenuItem key={subject._id} value={subject._id}>
            {subject.subjectName}
          </MenuItem>
        ))}
      </Select>

      {/* File Table */}
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>File Name</strong></TableCell>
              <TableCell align="right"><strong>Upload Date</strong></TableCell>
              <TableCell align="right"><strong>Download</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : files?.length > 0 ? (
              files.map((file) => (
                <TableRow key={file._id}>
                  <TableCell>{file.originalname}</TableCell>
                  <TableCell align="right">{moment(file.uploadDate).format("YYYY-MM-DD")}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="primary" onClick={() => dispatch(downloadFile(file._id, file.originalname))}>
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No files available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  selectBox: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "40%",
    marginBottom: "20px",
  },
  tableContainer: {
    width: "100%",
    maxHeight: "350px",
    overflowY: "auto",
  },
};

export default Body;
