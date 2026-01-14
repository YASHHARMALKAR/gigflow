const express = require('express');
const router = express.Router();
const { createBid, getBidsByGigId, hireFreelancer, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsByGigId);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
