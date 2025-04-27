import PettyCash from '../models/PettyCashModel.js';

// Create a new petty cash entry
const createPettyCashEntry = async (req, res) => {
    try {
        const { receiptNumber, date, details, vnNumber, expenses } = req.body;

        const newEntry = new PettyCash({
            receiptNumber,
            date,
            details,
            vnNumber,
            expenses,
            total: expenses // initially, total = expenses for a single entry
        });

        await newEntry.save();

        res.status(201).json({ message: 'Petty Cash entry created', data: newEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all entries
const getPettyCashEntries = async (req, res) => {
    try {
        const entries = await PettyCash.find().sort({ createdAt: 1 }); // ascending by creation time
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single entry by ID
const getPettyCashEntryById = async (req, res) => {
    try {
        const entry = await PettyCash.findById(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an entry
const updatePettyCashEntry = async (req, res) => {
    try {
        const updated = await PettyCash.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry updated', data: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an entry
const deletePettyCashEntry = async (req, res) => {
    try {
        const deleted = await PettyCash.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createPettyCashEntry,
    getPettyCashEntries,
    getPettyCashEntryById,
    updatePettyCashEntry,
    deletePettyCashEntry
};
