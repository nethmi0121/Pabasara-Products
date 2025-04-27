import mongoose from 'mongoose';

const BankBookSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    deposit: { type: Number, default: 0 },
    withdrawal: { type: Number, default: 0 },
    balance: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('BankBook', BankBookSchema);
