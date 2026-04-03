const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'PRT',
      'TGT',
      'PGT',
      'PRT + TGT',
      'TGT + PGT',
      'PRT + TGT + PGT',
      'Principal',
      'Vice-Principal',
      'Non-Teaching'
    ],
    required: true
  },
  numberOfPosts: { type: Number, required: true },
  salary: { type: String, required: true },
});

const schoolProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Basic Info
    schoolName: { type: String, required: true },
    directorContact: { type: String, required: true },

    // Address
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },

    // Vacancies
    vacancies: [vacancySchema],

    // Facilities
    accommodationProvided: { type: Boolean, required: true },
    healthInsuranceProvided: { type: Boolean, required: true },

    // Agreement
    termsAccepted: { type: Boolean, required: true },

    // Existing fields (optional keep)
    phone: { type: String },
    email: { type: String },
    website: { type: String },

    isVerified: { type: Boolean, default: false },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchoolProfile', schoolProfileSchema);