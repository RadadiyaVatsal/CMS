import mongoose from "mongoose";

const BatchSchema = mongoose.Schema({
  startYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
});

// Create a compound index to enforce unique combinations of startYear and endYear
BatchSchema.index({ startYear: 1, endYear: 1 }, { unique: true });

export default mongoose.model("batch", BatchSchema);
