import express from "express";
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
} from "../controller/facultyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateFaculty);
router.post("/createtest", auth, createTest);
router.post("/gettest", auth, getTest);
router.post("/getstudent", auth, getStudent);
router.post("/uploadmarks", auth, uploadMarks);
router.post("/markattendance", auth, markAttendance);
router.post("/getsubject" , auth , getSubject);
router.post("/gettestmarks", auth, getTestMarks);
router.post("/getstudentforattendance", auth, getStudentForAttendence);
router.get("/attendance-by-date", auth, getAttendanceByDate);
router.post("/updateattendance", auth, updateAttendance);
export default router;
