const mongoose = require('mongoose');

const sliderImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String },
  title: { type: String },
  subtitle: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const bannerSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String },
  title: { type: String },
  position: { type: String, enum: ['top', 'middle', 'bottom'], default: 'top' },
  isActive: { type: Boolean, default: true },
});

const vacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  classLevel: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  postedAt: { type: Date, default: Date.now },
});

const siteContentSchema = new mongoose.Schema(
  {
    sliderImages: [sliderImageSchema],
    banners: [bannerSchema],
    vacancies: [vacancySchema],
    stats: {
      happyClients: { type: Number, default: 500 },
      successfulPlacements: { type: Number, default: 1200 },
      conversionRate: { type: Number, default: 95 },
      awards: { type: Number, default: 15 },
    },
    aboutText: {
      type: String,
      default:
        'Maa Savitri Consultancy Services connects skilled teachers with top schools, ensuring quality education and professional growth.',
    },
    contactInfo: {
      phone: { type: String, default: '+91 98765 43210' },
      email: { type: String, default: 'info@maasavitri.com' },
      address: { type: String, default: 'New Delhi, India' },
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      whatsapp: { type: String },
      telegram: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
