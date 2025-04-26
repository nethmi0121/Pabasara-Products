const mongoose = require('mongoose');

const PettyCashSchema = new mongoose.Schema({
    receiptNumber: { type: String, required: true },
    date: { type: Date, required: true },
    details: { type: String, required: true },
    vnNumber: { type: String, required: true },
    expenses: { type: Number, required: true },
    total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PettyCash', PettyCashSchema);
