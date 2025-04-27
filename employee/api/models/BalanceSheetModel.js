import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
    date: { type: Date },
    description: { type: String },
    amount: { type: Number },
    total: { type: Number }
}, { _id: false }); // Prevent auto-generating _id for subdocs

const BalancesheetSchema = new mongoose.Schema({
    income: { type: EntrySchema, default: {} },
    expense: { type: EntrySchema, default: {} }
}, { timestamps: true });

export default mongoose.model('Balancesheet', BalancesheetSchema);
