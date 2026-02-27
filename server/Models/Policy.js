import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a policy title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Life', 'Health', 'Home', 'Auto', 'Travel', 'Property', 'Business', 'Other'],
        default: 'Other'
    },
    premium: {
        type: Number,
        required: [true, 'Please add a premium amount']
    },
    coverage: {
        type: String,
        required: [true, 'Please add coverage details'],
        trim: true
    },
    duration: {
        type: Number,
        // required: [true, 'Please add duration in years'], // Made optional for compatibility
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Policy', policySchema);
