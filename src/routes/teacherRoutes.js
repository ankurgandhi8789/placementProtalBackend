const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume, uploadPhoto, getStatus } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/multer');

router.use(protect, authorize('teacher'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.get('/status', getStatus);

module.exports = router;
