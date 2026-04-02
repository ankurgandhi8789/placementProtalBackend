const User = require('../models/User');
const TeacherProfile = require('../models/TeacherProfile');
const SchoolProfile = require('../models/SchoolProfile');
const SiteContent = require('../models/SiteContent');
const imagekit = require('../config/imagekit');

// ─── TEACHER MANAGEMENT ───────────────────────────────────────────────────────

// @desc    Get all teachers
// @route   GET /api/admin/teachers
const getAllTeachers = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.currentStatus = status;

    let teachers = await TeacherProfile.find(query)
      .populate('user', 'name email phone createdAt')
      .populate('assignedSchool', 'schoolName city')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      teachers = teachers.filter(
        (t) =>
          t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await TeacherProfile.countDocuments(query);
    res.json({ teachers, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single teacher
// @route   GET /api/admin/teachers/:id
const getTeacher = async (req, res, next) => {
  try {
    const teacher = await TeacherProfile.findById(req.params.id)
      .populate('user', 'name email phone createdAt isActive')
      .populate('assignedSchool', 'schoolName city state');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher status
// @route   PUT /api/admin/teachers/:id/status
const updateTeacherStatus = async (req, res, next) => {
  try {
    const { currentStatus, adminNotes } = req.body;
    const teacher = await TeacherProfile.findByIdAndUpdate(
      req.params.id,
      { currentStatus, adminNotes },
      { new: true }
    ).populate('user', 'name email');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign teacher to school
// @route   PUT /api/admin/teachers/:id/assign
const assignTeacher = async (req, res, next) => {
  try {
    const { schoolId, requirementId } = req.body;
    const teacher = await TeacherProfile.findByIdAndUpdate(
      req.params.id,
      { assignedSchool: schoolId, currentStatus: 'assigned' },
      { new: true }
    ).populate('user', 'name email').populate('assignedSchool', 'schoolName city');

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Mark requirement as filled
    if (requirementId) {
      await SchoolProfile.findOneAndUpdate(
        { _id: schoolId, 'requirements._id': requirementId },
        { $set: { 'requirements.$.filledBy': teacher._id, 'requirements.$.isActive': false } }
      );
    }

    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

// ─── SCHOOL MANAGEMENT ────────────────────────────────────────────────────────

// @desc    Get all schools
// @route   GET /api/admin/schools
const getAllSchools = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let schools = await SchoolProfile.find()
      .populate('user', 'name email createdAt isActive')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      schools = schools.filter(
        (s) =>
          s.schoolName?.toLowerCase().includes(search.toLowerCase()) ||
          s.city?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await SchoolProfile.countDocuments();
    res.json({ schools, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single school
// @route   GET /api/admin/schools/:id
const getSchool = async (req, res, next) => {
  try {
    const school = await SchoolProfile.findById(req.params.id).populate('user', 'name email createdAt isActive');
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify school
// @route   PUT /api/admin/schools/:id/verify
const verifySchool = async (req, res, next) => {
  try {
    const school = await SchoolProfile.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified, adminNotes: req.body.adminNotes },
      { new: true }
    );
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (error) {
    next(error);
  }
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin (superadmin only)
// @route   POST /api/admin/create-admin
const createAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create admins' });
    }
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admins
// @route   GET /api/admin/admins
const getAllAdmins = async (req, res, next) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Forbidden' });
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password');
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

// ─── SITE CONTENT ─────────────────────────────────────────────────────────────

const getSiteContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    res.json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload slider image
// @route   POST /api/admin/content/slider
const addSliderImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `slider_${Date.now()}`,
      folder: '/slider',
    });

    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});

    content.sliderImages.push({
      url: result.url,
      fileId: result.fileId,
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      order: content.sliderImages.length,
    });
    await content.save();
    res.status(201).json(content.sliderImages[content.sliderImages.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete slider image
// @route   DELETE /api/admin/content/slider/:imageId
const deleteSliderImage = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne();
    const image = content.sliderImages.id(req.params.imageId);
    if (image?.fileId) await imagekit.deleteFile(image.fileId).catch(() => {});
    content.sliderImages.pull({ _id: req.params.imageId });
    await content.save();
    res.json({ message: 'Slider image removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add banner
// @route   POST /api/admin/content/banner
const addBanner = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await imagekit.upload({
      file: req.file.buffer.toString('base64'),
      fileName: `banner_${Date.now()}`,
      folder: '/banners',
    });

    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});

    content.banners.push({
      url: result.url,
      fileId: result.fileId,
      title: req.body.title || '',
      position: req.body.position || 'top',
    });
    await content.save();
    res.status(201).json(content.banners[content.banners.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/admin/content/banner/:bannerId
const deleteBanner = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne();
    const banner = content.banners.id(req.params.bannerId);
    if (banner?.fileId) await imagekit.deleteFile(banner.fileId).catch(() => {});
    content.banners.pull({ _id: req.params.bannerId });
    await content.save();
    res.json({ message: 'Banner removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stats
// @route   PUT /api/admin/content/stats
const updateStats = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    content.stats = { ...content.stats, ...req.body };
    await content.save();
    res.json(content.stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact info
// @route   PUT /api/admin/content/contact
const updateContactInfo = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    content.contactInfo = { ...content.contactInfo.toObject(), ...req.body };
    await content.save();
    res.json(content.contactInfo);
  } catch (error) {
    next(error);
  }
};

// @desc    Add vacancy
// @route   POST /api/admin/content/vacancies
const addVacancy = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    content.vacancies.push(req.body);
    await content.save();
    res.status(201).json(content.vacancies[content.vacancies.length - 1]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vacancy
// @route   PUT /api/admin/content/vacancies/:vacancyId
const updateVacancy = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne();
    const vacancy = content.vacancies.id(req.params.vacancyId);
    if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
    Object.assign(vacancy, req.body);
    await content.save();
    res.json(vacancy);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vacancy
// @route   DELETE /api/admin/content/vacancies/:vacancyId
const deleteVacancy = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne();
    content.vacancies.pull({ _id: req.params.vacancyId });
    await content.save();
    res.json({ message: 'Vacancy removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalTeachers, totalSchools, assigned, pending] = await Promise.all([
      TeacherProfile.countDocuments(),
      SchoolProfile.countDocuments(),
      TeacherProfile.countDocuments({ currentStatus: 'assigned' }),
      TeacherProfile.countDocuments({ currentStatus: 'applied' }),
    ]);

    const statusBreakdown = await TeacherProfile.aggregate([
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
    ]);

    res.json({ totalTeachers, totalSchools, assigned, pending, statusBreakdown });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeachers, getTeacher, updateTeacherStatus, assignTeacher,
  getAllSchools, getSchool, verifySchool,
  toggleUserActive, createAdmin, getAllAdmins,
  getSiteContent, addSliderImage, deleteSliderImage,
  addBanner, deleteBanner, updateStats, updateContactInfo,
  addVacancy, updateVacancy, deleteVacancy, getDashboardStats,
};
