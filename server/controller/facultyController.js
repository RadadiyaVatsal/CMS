import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import student from "../models/student.js";

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingFaculty.email,
        id: existingFaculty._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token: token });
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

    const faculty = await Faculty.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    await faculty.save();
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } =
      req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (name) {
      updatedFaculty.name = name;
      await updatedFaculty.save();
    }
    if (dob) {
      updatedFaculty.dob = dob;
      await updatedFaculty.save();
    }
    if (department) {
      updatedFaculty.department = department;
      await updatedFaculty.save();
    }
    if (contactNumber) {
      updatedFaculty.contactNumber = contactNumber;
      await updatedFaculty.save();
    }
    if (designation) {
      updatedFaculty.designation = designation;
      await updatedFaculty.save();
    }
    if (avatar) {
      updatedFaculty.avatar = avatar;
      await updatedFaculty.save();
    }
    res.status(200).json(updatedFaculty);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createTest = async (req, res) => {
  try {
    const { subject, date, test, totalMarks, faculty } = req.body;
    // console.log(req.body);
    const errors = { testError: String };
    const existingTest = await Test.findOne({
      test,
      faculty
    });
    if (existingTest) {
      errors.testError = "Given Test is already created";
      return res.status(400).json(errors);
    }

    const newTest = await new Test({
      totalMarks,
      subjectCode: subject,
      test,
      date,
      faculty,
    });

    await newTest.save();
    return res.status(200).json({ message: "Test created successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getTest = async (req, res) => {
  try {
    const { faculty } = req.body;

    const tests = await Test.find({ faculty });

    res.status(200).json({ result: tests });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getSubject = async (req, res) => {
  try {
    const { faculty } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });

    // Fetch subjects based on the filters
    let subjects = await Subject.find({ faculty: mongoose.Types.ObjectId(faculty)});
    // console.log(subjects);
    const errors = { noSubjectError: "" };
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }

    return res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: "" };
    errors.backendError = error.message || "An error occurred";
    res.status(500).json(errors);
  }
};

export const getStudentForAttendence = async (req, res) => {
  try {
    const { subject, date } = req.body;
    const errors = { noSubject: String, noStudent: String };
    if (!subject) {
      errors.noSubject = "No subject found";
      return res.status(404).json(errors);
    }
    const { batch, semester, department } = await Subject.findById(subject);
    const students = await Student.find({ batch, semester, department });
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const attendance = await Attendence.find({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
        }
     , subject : subject});
    //  console.log(attendance);
    //  console.log(students);

  
    if (!students || students.length == 0) {
      errors.noStudent = "No students found";
      return res.status(200).json({students, attendance});
    }
    return res.status(200).json({students, attendance});
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getStudent = async (req, res) => {
  try {
    const { department, test, faculty } = req.body;
    const testdata = await Test.findById(test);
    const { batch, semester } = await Subject.findOne({subjectCode: testdata.subjectCode, faculty});
    const errors = { noStudentError: String };
    const students = await Student.find({ department, batch, semester });

    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getTestMarks = async (req, res) => {
  try {
    const { test } = req.body;
    const studentMarks = await Marks.find({exam : test});
    res.status(200).json(studentMarks);
  } catch (error) {
    console.log("Error occured while fetching test marks of student");
    res.status(500).json(error);
  }
}
export const uploadMarks = async (req, res) => {
  try {
    const { test, marks } = req.body; // `test` is the test ID, and `marks` is the array of marks
    const existingMarks = await Marks.find({ exam: test }); // Fetch existing marks for this test

    if (existingMarks.length !== 0) {
      // Update marks for the existing test
      for (let i = 0; i < marks.length; i++) {
        await Marks.findOneAndUpdate(
          { student: marks[i]._id, exam: test }, // Match the student and test
          { marks: marks[i].value }, // Update marks
          { upsert: true, new: true } // Create the document if it doesn't exist
        );
      }
      return res.status(200).json({ message: "Marks updated successfully" });
    } else {
      // Create new marks for the test
      for (let i = 0; i < marks.length; i++) {
        const newMark = new Marks({
          student: marks[i]._id,
          exam: test,
          marks: marks[i].value,
        });
        await newMark.save();
      }
      return res.status(200).json({ message: "Marks uploaded successfully" });
    }
  } catch (error) {
    console.error("Error uploading marks:", error);
    return res.status(500).json({ backendError: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { subject } = req.body;
    // Get the current date's start and end (to filter records by date only)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day (00:00:00)
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day (23:59:59)

    const alreadyAdded = await Attendence.find({
      subject,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!alreadyAdded) {
      return res.status(400).json({  });
    }

    return res.status(200).json({alreadyAdded});

  } catch (error) {
    return res.status(404).json({error});
  }
}


export const getAttendanceByDate = async (req, res) => {
  try {
    const { facultyId, subjectId, date } = req.query;

    if (!facultyId || !subjectId || !date) {
      return res.status(400).json({ message: "Faculty ID, Subject ID, and Date are required." });
    }

    // Convert date to match database format
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch attendance records for the subject on the given date
    const attendanceRecords = await Attendance.find({
      subject: subjectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate("student", "name username semester");

    if (attendanceRecords.length > 0) {
      return res.status(200).json({ attendanceRecords });
    } else {
      return res.status(200).json({ message: "No attendance marked yet." });
    }
  } catch (error) {
    console.error("Error fetching attendance by date:", error);
    return res.status(500).json({ message: "Server error, please try again later." });
  }
};



export const markAttendance = async (req, res) => {
  try {
    const { subject, selectedStudents, totalStudents } = req.body;
    // console.log("selected students: ", selectedStudents)
    // console.log("total students: ", totalStudents)

    // Get the current date's start and end (to filter records by date only)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day (00:00:00)
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day (23:59:59)

    // Check if attendance is already marked for this subject today
    const alreadyAdded = await Attendence.findOne({
      subject,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    console.log(selectedStudents);

    if (alreadyAdded) {
      for (const student of totalStudents) {
        const val = selectedStudents.includes(student._id);
        
        const res = await Attendence.updateOne(
          { student: student._id, subject: subject, createdAt: { $gte: startOfDay, $lte: endOfDay } }, // Filter criteria
          { $set: { attended: val } }, // Update operation
          { new: true, runValidators: true }
        );
      }
      return res.status(200).json({ message: "Attendance updated." });
    }

    // Mark attendance for each student
    for (const student of totalStudents) {
      const attended = selectedStudents.includes(student._id);
      await Attendence.create({
        student: student._id,
        subject: subject,
        attended: attended
      });
    }

    res.status(200).json({ message: "Attendance marked successfully." });
  } catch (error) {
    res.status(500).json({ backendError: error.message });
  }
};

import fs from 'fs';
import File from '../models/file.js';

export const uploadFile = async (req, res) => {
    try {
       console.log(req.body);
        const file = new File({
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.body.facultyId,
            subjectId : req.body.subjectId
        });
        await file.save();
        res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error });
    }
};

// export const getFiles = async (_req, res) => {
//     try {
//         const files = await File.find();
//         res.json(files);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch files', error });
//     }
// };

// export const getFiles = async (req, res) => {
//   try {
//       const { facultyId, subjectId } = req.body;
        
//       // Ensure facultyId is provided
//       if (!facultyId) {
//           return res.status(400).json({ message: "Faculty ID is required" });
//       }
     
//       if(!subjectId){
//          const files=File.find({subjectId : subjectId});
//          res.json(files);
//          return res.status(200).json({message : " Successfully fatched"});
//       }
//       else{
//         const files=File.find();
//         res.json(files);
//         return res.status(200).json({message : " Successfully fatched"});
//       }
//       }
//     catch(error){
//       res.status(500).json({ message: 'Fatching failed', error });
//     }
    
// };

export const getFiles = async (req, res) => {
  try {
    const { facultyId, subjectId } = req.query; // Make sure frontend sends these as query params

    // console.log("Received facultyId:", facultyId);
    // console.log("Received subjectId:", subjectId);
    //  console.log(req.body);
    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }

    if(subjectId === ""){
      console.log(facultyId);
      const files = await File.find({uploadedBy : facultyId}).sort({ uploadDate: -1 }); // Fetch data from DB
      // console.log("Fetched Files:", files);
         return  res.json(files);
    }

    let query = { facultyId }; // Always filter by facultyId

    if (subjectId) {
      query.subjectId = subjectId; // If subject is selected, filter by subjectId
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


export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        fs.unlinkSync(file.path);
        await file.deleteOne();
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error });
    }
};