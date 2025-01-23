import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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
    const { test, marks } = req.body;
    // console.log(test);
    const isAlready = await Marks.find({
      exam: test,
    });
    const errors = {examError: ""};

    if (isAlready.length !== 0) {
      errors.examError = "You have already uploaded marks of given exam";
      return res.status(400).json(errors);
    }

    for (var i = 0; i < marks.length; i++) {
      const newMarks = await new Marks({
        student: marks[i]._id,
        exam: existingTest._id,
        marks: marks[i].value,
      });
      await newMarks.save();
    }
    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    console.log("here", error);
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    const sub = await Subject.findOne({ subjectName });

    const allStudents = await Student.find({ department, year, section });

    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendence.findOne({
        student: allStudents[i]._id,
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        attendence.totalLecturesByFaculty += 1;
        await attendence.save();
      } else {
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    for (var a = 0; a < selectedStudents.length; a++) {
      const pre = await Attendence.findOne({
        student: selectedStudents[a],
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: selectedStudents[a],
          subject: sub._id,
        });

        attendence.lectureAttended += 1;
        await attendence.save();
      } else {
        pre.lectureAttended += 1;
        await pre.save();
      }
    }
    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
