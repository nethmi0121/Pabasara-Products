import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: String,  // Change this to String to store UUID directly
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Payment', PaymentSchema);