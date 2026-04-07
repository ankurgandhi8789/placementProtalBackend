const express = require('express');
const router = express.Router();
const {
  getAllTeachers, getTeacher, updateTeacherStatus, assignTeacher,
  getAllSchools, getSchool, verifySchool,
  toggleUserActive, createAdmin, getAllAdmins,
  getSiteContent, addSliderImage, deleteSliderImage,
  updateStats, updateContactInfo,
  addVacancy, updateVacancy, deleteVacancy, getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/multer');

router.use(protect, authorize('admin', 'superadmin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Teachers
router.get('/teachers', getAllTeachers);
router.get('/teachers/:id', getTeacher);
router.put('/teachers/:id/status', updateTeacherStatus);
router.put('/teachers/:id/assign', assignTeacher);

// Schools
router.get('/schools', getAllSchools);
router.get('/schools/:id', getSchool);
router.put('/schools/:id/verify', verifySchool);

// Users
router.put('/users/:id/toggle-active', toggleUserActive);
router.post('/create-admin', createAdmin);
router.get('/admins', getAllAdmins);

// Site Content
router.get('/content', getSiteContent);
router.post('/content/slider', upload.single('image'), addSliderImage);
router.delete('/content/slider/:imageId', deleteSliderImage);
router.put('/content/stats', updateStats);
router.put('/content/contact', updateContactInfo);
router.post('/content/vacancies', upload.single('image'), addVacancy);
router.put('/content/vacancies/:vacancyId', upload.single('image'), updateVacancy);
router.delete('/content/vacancies/:vacancyId', deleteVacancy);

module.exports = router;
