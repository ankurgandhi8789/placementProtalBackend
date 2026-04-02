const TeacherProfile = require('../models/TeacherProfile');
const imagekit = require('../config/imagekit');

// @desc    Get teacher profile
// @route   GET /api/teacher/profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher profile
// @route   PUT /api/teacher/profile
const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const profile = await TeacherProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...updates, isProfileComplete: true },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email');
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/teacher/upload-resume
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profile = await TeacherProfile.findOne({ user: req.user._id });

    // Delete old resume from ImageKit
    if (profile?.resumeFileId) {
      await imagekit.deleteFile(profile.resumeFileId).catch(() => {});
    }

    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `resume_${req.user._id}_${Date.now()}.pdf`,
      folder: '/resumes',
    });

    await TeacherProfile.findOneAndUpdate(
      { user: req.user._id },
      { resume: result.url, resumeFileId: result.fileId, resumeOriginalName: req.file.originalname },
      { upsert: true }
    );

    res.json({ url: result.url, fileId: result.fileId });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile photo
// @route   POST /api/teacher/upload-photo
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profile = await TeacherProfile.findOne({ user: req.user._id });
    if (profile?.profilePhotoFileId) {
      await imagekit.deleteFile(profile.profilePhotoFileId).catch(() => {});
    }

    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `photo_${req.user._id}_${Date.now()}`,
      folder: '/profile-photos',
    });

    await TeacherProfile.findOneAndUpdate(
      { user: req.user._id },
      { profilePhoto: result.url, profilePhotoFileId: result.fileId },
      { upsert: true }
    );

    res.json({ url: result.url, fileId: result.fileId });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher status
// @route   GET /api/teacher/status
const getStatus = async (req, res, next) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id })
      .select('currentStatus adminNotes assignedSchool')
      .populate('assignedSchool', 'schoolName city state');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadResume, uploadPhoto, getStatus };
