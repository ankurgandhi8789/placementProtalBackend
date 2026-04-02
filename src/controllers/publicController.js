const SiteContent = require('../models/SiteContent');

// @desc    Get public site content (homepage)
// @route   GET /api/public/content
const getPublicContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne().select('sliderImages banners stats aboutText contactInfo');
    if (!content) content = await SiteContent.create({});
    res.json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Get public vacancies
// @route   GET /api/public/vacancies
const getPublicVacancies = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne().select('vacancies');
    const vacancies = content?.vacancies?.filter((v) => v.isActive) || [];
    res.json(vacancies);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicContent, getPublicVacancies };
