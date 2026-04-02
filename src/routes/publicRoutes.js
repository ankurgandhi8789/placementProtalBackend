const express = require('express');
const router = express.Router();
const { getPublicContent, getPublicVacancies } = require('../controllers/publicController');

router.get('/content', getPublicContent);
router.get('/vacancies', getPublicVacancies);

module.exports = router;
