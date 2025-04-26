const express = require('express');
const router = express.Router();
const {
    createBankEntry,
    getBankEntries,
    getBankEntryById,
    updateBankEntry,
    deleteBankEntry
} = require('../Controllers/BankBookController'); // Adjust the path if needed

// Routes
router.post('/', createBankEntry);
router.get('/', getBankEntries);
router.get('/:id', getBankEntryById);
router.put('/:id', updateBankEntry);
router.delete('/:id', deleteBankEntry);

module.exports = router;
