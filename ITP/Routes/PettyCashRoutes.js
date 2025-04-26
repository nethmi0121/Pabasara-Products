const express = require('express');
const router = express.Router();
const {
    createPettyCashEntry,
    getPettyCashEntries,
    getPettyCashEntryById,
    updatePettyCashEntry,
    deletePettyCashEntry
} = require('../Controllers/PettyCashController');

// Define routes
router.post('/', createPettyCashEntry);
router.get('/', getPettyCashEntries);
router.get('/:id', getPettyCashEntryById);
router.put('/:id', updatePettyCashEntry);
router.delete('/:id', deletePettyCashEntry);

module.exports = router;
