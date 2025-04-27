import express from 'express';
import {
    createBankEntry,
    getBankEntries,
    getBankEntryById,
    updateBankEntry,
    deleteBankEntry
} from '../controllers/BankBookController.js'; // Ensure path is correct

const router = express.Router();

// Define routes
router.post('/', createBankEntry);
router.get('/', getBankEntries);
router.get('/:id', getBankEntryById);
router.put('/:id', updateBankEntry);
router.delete('/:id', deleteBankEntry);

export default router;
