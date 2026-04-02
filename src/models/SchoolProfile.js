const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  classLevel: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  filledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherProfile' },
});

const schoolProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    schoolName: { type: String, required: true },
    logo: { type: String },
    logoFileId: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    schoolType: { type: String, enum: ['government', 'private', 'aided', 'international'] },
    board: { type: String },
    website: { type: String },
    requirements: [requirementSchema],
    isVerified: { type: Boolean, default: false },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchoolProfile', schoolProfileSchema);
