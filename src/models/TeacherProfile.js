const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  percentage: { type: String },
});

const teacherProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profilePhoto: { type: String },
    profilePhotoFileId: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    subjects: [{ type: String }],
    classLevels: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    experienceDetails: { type: String },
    education: [educationSchema],
    resume: { type: String },
    resumeFileId: { type: String },
    resumeOriginalName: { type: String },
    expectedSalary: { type: String },
    currentStatus: {
      type: String,
      enum: ['applied', 'contacted', 'test_scheduled', 'interview', 'assigned', 'completed', 'rejected'],
      default: 'applied',
    },
    adminNotes: { type: String },
    assignedSchool: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolProfile' },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
