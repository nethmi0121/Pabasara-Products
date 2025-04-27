const BalanceSheet = require('../Model/BalanceSheetModel.js');

// Create a new balance sheet entry
const createEntry = async (req, res) => {
    try {
        const { income, expense } = req.body;

        // Get all entries to calculate correct totals
        const entries = await BalanceSheet.find();

        let incomeTotal = 0;
        let expenseTotal = 0;

        for (const entry of entries) {
            if (entry.income) {
                incomeTotal += entry.income.amount || 0;
            }
            if (entry.expense) {
                expenseTotal += entry.expense.amount || 0;
            }
        }

        const newIncome = income ? {
            ...income,
            total: incomeTotal + (income.amount || 0)
        } : undefined;

        const newExpense = expense ? {
            ...expense,
            total: expenseTotal + (expense.amount || 0)
        } : undefined;

        const newEntry = new BalanceSheet({ income: newIncome, expense: newExpense });
        await newEntry.save();

        res.status(201).json({ message: 'Balance sheet entry created', data: newEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get all balance sheet entries
const getEntries = async (req, res) => {
    try {
        const entries = await BalanceSheet.find();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single entry by ID
const getEntryById = async (req, res) => {
    try {
        const entry = await BalanceSheet.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a balance sheet entry
const updateEntry = async (req, res) => {
    try {
        const updated = await BalanceSheet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: 'Entry not found' });

        await recalculateTotals(); // Recalculate after update

        res.status(200).json({ message: 'Entry updated', data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete an entry
const deleteEntry = async (req, res) => {
    try {
        const deleted = await BalanceSheet.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Entry not found' });

        await recalculateTotals(); // Recalculate after delete

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Helper to recalculate totals
const recalculateTotals = async () => {
    const entries = await BalanceSheet.find().sort({ createdAt: 1 }); // oldest first

    let incomeTotal = 0;
    let expenseTotal = 0;

    for (const entry of entries) {
        if (entry.income) {
            incomeTotal += entry.income.amount || 0;
            entry.income.total = incomeTotal;
        }
        if (entry.expense) {
            expenseTotal += entry.expense.amount || 0;
            entry.expense.total = expenseTotal;
        }
        await entry.save(); // Save updated entry
    }
};


module.exports = {
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry
};
