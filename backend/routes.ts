import { Router } from 'express';
import { processResults } from './controller';

export const router = Router();

router.post('/results', processResults);