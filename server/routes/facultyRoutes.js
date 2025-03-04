import express from "express";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
  getSubject,
  getTestMarks,
  getStudentForAttendence,
  getAttendanceByDate,
  updateAttendance,
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "../controller/facultyController.js";
const router = express.Router();

// Ensure __dirname is available in ES module
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/"), // Adjusted path
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Faculty Routes
router.post("/login", facultyLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateFaculty);
router.post("/createtest", auth, createTest);
router.post("/gettest", auth, getTest);
router.post("/getstudent", auth, getStudent);
router.post("/uploadmarks", auth, uploadMarks);
router.post("/markattendance", auth, markAttendance);
router.post("/getsubject", auth, getSubject);
router.post("/gettestmarks", auth, getTestMarks);
router.post("/getstudentforattendance", auth, getStudentForAttendence);
router.get("/attendance-by-date", auth, getAttendanceByDate);
router.post("/updateattendance", auth, updateAttendance);

// File Upload Routes
router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/files", auth, getFiles);
router.get("/download/:id", auth, downloadFile);
router.delete("/file/:id", auth, deleteFile);

export default router;
