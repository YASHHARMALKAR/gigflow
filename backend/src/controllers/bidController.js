const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

// @desc    Create a bid
// @route   POST /api/bids
// @access  Private
const createBid = async (req, res) => {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }

    // Prevent owner from bidding on own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    const bid = await Bid.create({
        gigId,
        freelancerId: req.user._id,
        message,
        price,
    });

    res.status(201).json(bid);
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getBidsByGigId = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
};

const getMyBids = async (req, res) => {
    const bids = await Bid.find({ freelancerId: req.user._id }).populate('gigId');
    res.json(bids);
}

// @desc    Hire a freelancer
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);

        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);

        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check if user is owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if gig is already assigned
        if (gig.status === 'assigned') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Gig already assigned' });
        }

        // Update Gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // Update Selected Bid status
        bid.status = 'hired';
        await bid.save({ session });

        // Reject other bids
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Emit Socket Event
        // We access the io instance from the app (passed in req or global)
        // For this implementation, let's assume io is attached to req.app
        const io = req.app.get('io');
        if (io) {
            io.to(bid.freelancerId.toString()).emit('notification', {
                message: `You have been hired for ${gig.title}`,
                gigId: gig._id
            });
        }

        res.json({ message: 'Freelancer hired successfully', bid });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
};

module.exports = { createBid, getBidsByGigId, hireFreelancer, getMyBids };
