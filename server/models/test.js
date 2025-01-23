import mongoose from "mongoose";
const { Schema } = mongoose;

const testSchema = mongoose.Schema({
  test: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
 
  totalMarks: {
    type: Number,
    default: 10,
  },
  date: {
    type: String,
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "faculty",
  }
});

export default mongoose.model("test", testSchema);
