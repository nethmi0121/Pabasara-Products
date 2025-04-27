import express from 'express';
import {
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry
} from '../controllers/BalanceSheetController.js'; // Ensure the path is correct

const router = express.Router();

// Routes
router.post('/', createEntry);
router.get('/', getEntries);
router.get('/:id', getEntryById);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
