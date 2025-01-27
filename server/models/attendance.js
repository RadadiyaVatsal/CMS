import mongoose from "mongoose";
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  attended: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("attendance", attendanceSchema);
