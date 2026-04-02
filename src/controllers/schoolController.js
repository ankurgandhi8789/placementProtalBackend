const SchoolProfile = require('../models/SchoolProfile');
const imagekit = require('../config/imagekit');

// @desc    Get school profile
// @route   GET /api/school/profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update school profile
// @route   PUT /api/school/profile
const updateProfile = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email');
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload school logo
// @route   POST /api/school/upload-logo
const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profile = await SchoolProfile.findOne({ user: req.user._id });
    if (profile?.logoFileId) {
      await imagekit.deleteFile(profile.logoFileId).catch(() => {});
    }

    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `logo_${req.user._id}_${Date.now()}`,
      folder: '/school-logos',
    });

    await SchoolProfile.findOneAndUpdate(
      { user: req.user._id },
      { logo: result.url, logoFileId: result.fileId },
      { upsert: true }
    );

    res.json({ url: result.url, fileId: result.fileId });
  } catch (error) {
    next(error);
  }
};

// @desc    Add requirement
// @route   POST /api/school/requirements
const addRequirement = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'School profile not found' });

    profile.requirements.push(req.body);
    await profile.save();
    res.status(201).json(profile.requirements[profile.requirements.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update requirement
// @route   PUT /api/school/requirements/:reqId
const updateRequirement = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne({ user: req.user._id });
    const req_item = profile.requirements.id(req.params.reqId);
    if (!req_item) return res.status(404).json({ message: 'Requirement not found' });

    Object.assign(req_item, req.body);
    await profile.save();
    res.json(req_item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete requirement
// @route   DELETE /api/school/requirements/:reqId
const deleteRequirement = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne({ user: req.user._id });
    profile.requirements.pull({ _id: req.params.reqId });
    await profile.save();
    res.json({ message: 'Requirement removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get school requirements
// @route   GET /api/school/requirements
const getRequirements = async (req, res, next) => {
  try {
    const profile = await SchoolProfile.findOne({ user: req.user._id }).select('requirements schoolName');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile.requirements);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadLogo, addRequirement, updateRequirement, deleteRequirement, getRequirements };
