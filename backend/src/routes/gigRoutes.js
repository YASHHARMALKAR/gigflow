const express = require('express');
const router = express.Router();
const { createGig, getGigs, getGigById } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getGigs);
router.get('/:id', getGigById);

// Protected routes
router.post('/', protect, createGig);

module.exports = router;
