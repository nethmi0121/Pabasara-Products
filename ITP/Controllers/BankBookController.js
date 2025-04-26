const BankBook = require('../Model/BankBookModel');

// Create a new bank book entry
const createBankEntry = async (req, res) => {
    try {
        const { date, description, deposit = 0, withdrawal = 0 } = req.body;

        const lastEntry = await BankBook.findOne().sort({ createdAt: -1 });
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
        const entries = await BankBook.find().sort({ createdAt: 1 }); // Sort ascending
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

// Update
const updateBankEntry = async (req, res) => {
    try {
        const updated = await BankBook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry updated', data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete
const deleteBankEntry = async (req, res) => {
    try {
        const deleted = await BankBook.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted successfully' });
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
