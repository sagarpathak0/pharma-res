import { Router } from 'express';
import { processResults, searchResults } from './controller';

export const router = Router();

// Results upload route
router.post('/results', processResults);

// Results search route
router.post('/results/search', searchResults);

// Base route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Pharmacy Results API' });
});