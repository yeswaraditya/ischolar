import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    applicantWallet: { type: String, required: true, lowercase: true },
    requestedAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending AI Review', 'Pending Vote', 'Approved', 'Rejected'],
        default: 'Pending AI Review'
    },
    // This will store the numerical ID from the smart contract (e.g., 0, 1, 2...)
    onChainId: { type: Number }, 
    aiEvaluation: {
        // ...
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;