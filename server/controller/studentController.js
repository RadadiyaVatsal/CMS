import student from "../models/student.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import File from "../models/file.js";
export const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      errors.usernameError = "Student doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingStudent.email,
        id: existingStudent._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingStudent, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (dob) {
      updatedStudent.dob = dob;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (contactNumber) {
      updatedStudent.contactNumber = contactNumber;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (section) {
      updatedStudent.section = section;
      await updatedStudent.save();
    }
    if (year) {
      updatedStudent.year = year;
      await updatedStudent.save();
    }
    if (motherName) {
      updatedStudent.motherName = motherName;
      await updatedStudent.save();
    }
    if (fatherName) {
      updatedStudent.fatherName = fatherName;
      await updatedStudent.save();
    }
    if (fatherContactNumber) {
      updatedStudent.fatherContactNumber = fatherContactNumber;
      await updatedStudent.save();
    }
    if (avatar) {
      updatedStudent.avatar = avatar;
      await updatedStudent.save();
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const testResult = async (req, res) => {
  try {
    const { studentId } = req.body;
    const errors = { notestError: String };
    const result = await Marks.find({ student: studentId });
    let answer = [];
    
    if (result.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    
    for (var i = 0; i < result.length; i++) {
      const { subjectCode, totalMarks, test } = await Test.findById(result[i].exam);
      var subject = await Subject.findOne({ subjectCode });
      var temp = {
        marks: result[i].marks,
        totalMarks: totalMarks,
        subjectName: subject.subjectName,
        subjectCode,
        test,
      };
      
      answer.push(temp);
    }
    
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const attendance = async (req, res) => {
  try {
    const { studentId } = req.body;
    const errors = { notestError: String };
    let subjectSet = new Set();
    let attendedLec = {};

    const attendenceData = await Attendence.find({
      student: studentId,
    }).populate("subject");

    if (!attendenceData) {
      res.status(400).json({ message: "Attendence not found" });
    }

    attendenceData.forEach(a => {
      if (!subjectSet.has(a.subject.subjectCode)) {
        subjectSet.add(a.subject.subjectCode);
        attendedLec[a.subject.subjectCode] = [0, 0];
      }
      if (subjectSet.has(a.subject.subjectCode) && a.attended) {
        attendedLec[a.subject.subjectCode][0] += 1;
      }
      attendedLec[a.subject.subjectCode][1] += 1
    });
    const unique = attendenceData.reduce((acc, obj) => {
      if (!acc.some(item => item.subjectCode === obj.subject.subjectCode)) {
        acc.push({subjectCode: obj.subject.subjectCode, subject: obj.subject.subjectName, attended: (attendedLec[obj.subject.subjectCode][0]), total: attendedLec[obj.subject.subjectCode][1]});
      }
      return acc;
    }, []);
    
    res.status(200).json({
      result: unique,
      attendedLec,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

import path from "path";

export const downloadFile = async (req, res) => {
  try {
    // console.log("We are here inside controller");
    
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.resolve(file.path); // Ensure correct file path
    console.log("Downloading file from:", filePath);

    res.download(filePath, file.originalname, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Download failed", error: err });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Download failed", error });
  }
};

export const getFiles = async (req, res) => {
  try {
    const {  subjectId } = req.query; // Make sure frontend sends these as query params

    // console.log("Received facultyId:", facultyId);
    // console.log("Received subjectId:", subjectId);


    let query = { subjectId }; // Always filter by facultyId

     if(subjectId == ""){
      const files = await File.find().sort({ uploadDate: -1 }); // Fetch data from DB
      console.log("Fetched Files:", files);
       return  res.json(files);
     }

    console.log("Query:", query);

    const files = await File.find(query).sort({ uploadDate: -1 }); // Fetch data from DB
    console.log("Fetched Files:", files);
       return  res.json(files);
    // return res.status(200).json({ message: "Successfully fetched", files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ message: "Fetching failed", error });
  }
};