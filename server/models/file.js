import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    originalname: String,
    path: String,
    uploadedBy: String, // Faculty ID
    subjectId: String, // student ID
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
export default File;
