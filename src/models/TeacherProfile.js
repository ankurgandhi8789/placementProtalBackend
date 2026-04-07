const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  specialization: { type: String },
  institution: { type: String, required: true },
  boardOrUniversity: { type: String },
  yearOfPassing: { type: Number, required: true },
  percentage: { type: Number, min: 0, max: 100 },
});

const experienceSchema = new mongoose.Schema({
  schoolName: String,
  role: String,
  subject: String,
  startDate: Date,
  endDate: Date,
  currentlyWorking: { type: Boolean, default: false },
});

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // 👤 Basic
    fullName: { type: String },
    phone: { type: String },
    alternatePhone: String,
    email: String,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: Date,

    // 📍 Address
    currentAddress: { type: String },
    permanentAddress: String,
    city: String,
    state: String,
    pincode: String,

    // 📚 Education
    education: [educationSchema],

    // 🎓 Teaching Qualification (IMPORTANT ADD)
    teachingQualifications: [
      { type: String, enum: ['B.Ed', 'D.El.Ed', 'Other'] },
    ],

    // 🎯 Teaching
    subjects: [{ type: String }],
    classLevels: [{ type: String }],
    preferredLocations: [{ type: String }],

    // 💼 Experience
    experienceYears: { type: Number, default: 0 },
    experienceDetails: String,
    experiences: [experienceSchema],

    // 📄 Files
    profilePhoto: String,
    profilePhotoFileId: String,

    resume: String,
    resumeFileId: String,
    resumeOriginalName: String,

    // 📊 Status
    currentStatus: {
      type: String,
      enum: [
        'applied',
        'contacted',
        'test_scheduled',
        'test_completed',
        'interview_scheduled',
        'interview_completed',
        'assigned',
        'completed',
        'rejected',
      ],
      default: 'applied',
    },

    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],

    adminNotes: String,

    // 🏫 Assignment
    assignedSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SchoolProfile',
    },
    assignedAt: Date,

    // 📅 Scheduling
    testDate: Date,
    interviewDate: Date,

    // ✅ Flags
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },

    // 📜 Legal
    termsAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);