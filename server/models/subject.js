import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  totalLectures: {
    type: Number,
    default: 10,
  },
  semester: {
    type: Number,
    required: true,
  },
  batch: {
    type: Schema.Types.ObjectId,
    ref: "batch",
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "faculty",
  },
});

export default mongoose.model("subject", subjectSchema);
