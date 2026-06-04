const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// @route   GET /api/brands
// @desc    Get all brands (public endpoint for Academy page)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
