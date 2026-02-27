import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ userId: 1, policyId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
