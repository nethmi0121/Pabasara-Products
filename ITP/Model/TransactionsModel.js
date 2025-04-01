const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    income_source: { type: String, required: true },
    total_income: { type: Number, required: true },
    expense_type: { type: String, required: true },
    total_expenses: { type: Number, required: true },
    profit: { type: Number }, // Auto-calculated before saving
    date: { type: Date, default: Date.now }
});

// Pre-save hook to calculate profit
TransactionSchema.pre('save', function (next) {
    this.profit = this.total_income - this.total_expenses;
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
