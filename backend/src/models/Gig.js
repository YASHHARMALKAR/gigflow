const mongoose = require('mongoose');

const gigSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['open', 'assigned'],
            default: 'open',
        },
    },
    {
        timestamps: true,
    }
);

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;
