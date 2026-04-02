const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, uploadLogo,
  addRequirement, updateRequirement, deleteRequirement, getRequirements,
} = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/multer');

router.use(protect, authorize('school'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/upload-logo', upload.single('logo'), uploadLogo);
router.get('/requirements', getRequirements);
router.post('/requirements', addRequirement);
router.put('/requirements/:reqId', updateRequirement);
router.delete('/requirements/:reqId', deleteRequirement);

module.exports = router;
