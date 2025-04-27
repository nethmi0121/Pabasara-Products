import express from 'express';
import {
    createPettyCashEntry,
    getPettyCashEntries,
    getPettyCashEntryById,
    updatePettyCashEntry,
    deletePettyCashEntry
} from '../controllers/PettyCashController.js';

const router = express.Router();

// Define routes
router.post('/', createPettyCashEntry);
router.get('/', getPettyCashEntries);
router.get('/:id', getPettyCashEntryById);
router.put('/:id', updatePettyCashEntry);
router.delete('/:id', deletePettyCashEntry);

export default router;
