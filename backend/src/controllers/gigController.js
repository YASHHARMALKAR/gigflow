const Gig = require('../models/Gig');

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const gig = await Gig.create({
        title,
        description,
        budget,
        ownerId: req.user._id,
    });

    res.status(201).json(gig);
};

// @desc    Get all gigs (with search)
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    const { search } = req.query;

    let query = { status: 'open' };

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });

    res.json(gigs);
};

// @desc Get gig by ID
// @route GET /api/gigs/:id
// @access Private
const getGigById = async (req, res) => {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    if (gig) {
        res.json(gig);
    } else {
        res.status(404).json({ message: 'Gig not found' });
    }
}

module.exports = {
    createGig,
    getGigs,
    getGigById
};
