import express from 'express';
import { fuzzyMatch,fuzzyAutocomplete } from '../Controllers/search.controller.js';

const router = express.Router();

// Fuzzy search products by name
router.get('/search',fuzzyMatch);

// Autocomplete endpoint with fuzzy matching
router.get('/autocomplete', fuzzyAutocomplete);

export default router;