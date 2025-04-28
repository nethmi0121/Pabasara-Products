const BankBook = require('../Model/BankBookModel');

// Helper to recalculate balances starting from a specific date
const recalculateBalances = async (startDate) => {
    const entries = await BankBook.find({ date: { $gte: startDate } }).sort({ date: 1, createdAt: 1 });

    let lastEntry = await BankBook.findOne({ date: { $lt: startDate } }).sort({ date: -1, createdAt: -1 });
    let balance = lastEntry ? lastEntry.balance : 0;

    for (let entry of entries) {
        balance = balance + Number(entry.deposit) - Number(entry.withdrawal);
        entry.balance = balance;
        await entry.save();
    }
};

// Create a new bank book entry
const createBankEntry = async (req, res) => {
    try {
        const { date, description, deposit = 0, withdrawal = 0 } = req.body;

        const lastEntry = await BankBook.findOne().sort({ date: -1, createdAt: -1 });
        let lastBalance = lastEntry ? lastEntry.balance : 0;

        const newBalance = lastBalance + Number(deposit) - Number(withdrawal);

        const newEntry = new BankBook({
            date,
            description,
            deposit,
            withdrawal,
            balance: newBalance
        });

        await newEntry.save();

        res.status(201).json({ message: 'Bank book entry created', data: newEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all entries
const getBankEntries = async (req, res) => {
    try {
        const entries = await BankBook.find().sort({ date: 1, createdAt: 1 }); // sort by date ascending
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get one entry
const getBankEntryById = async (req, res) => {
    try {
        const entry = await BankBook.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an entry and recalculate following balances
const updateBankEntry = async (req, res) => {
    try {
        const entry = await BankBook.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        // Update the fields
        entry.date = req.body.date || entry.date;
        entry.description = req.body.description || entry.description;
        entry.deposit = req.body.deposit !== undefined ? req.body.deposit : entry.deposit;
        entry.withdrawal = req.body.withdrawal !== undefined ? req.body.withdrawal : entry.withdrawal;

        await entry.save();

        // Recalculate balances from the updated entry date
        await recalculateBalances(entry.date);

        res.status(200).json({ message: 'Entry updated and balances recalculated', data: entry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an entry and recalculate following balances
const deleteBankEntry = async (req, res) => {
    try {
        const entry = await BankBook.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });

        const entryDate = entry.date;
        await entry.deleteOne();

        // Recalculate balances from the deleted entry's date
        await recalculateBalances(entryDate);

        res.status(200).json({ message: 'Entry deleted and balances recalculated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBankEntry,
    getBankEntries,
    getBankEntryById,
    updateBankEntry,
    deleteBankEntry
};
