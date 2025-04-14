import { Router } from 'express';
import { 
  processResults, 
  searchResults, 
  getAcademicYears,
  updateStudentCampus,
  updateReappearMarks,
  updateRegularMarks
} from './controller';

export const router = Router();

// Results upload route
router.post('/results', processResults);

// Results search route
router.post('/results/search', searchResults);

// Academic years route
router.get('/academic-years/:rollNo', getAcademicYears);

// New update routes
router.put('/students/:rollNo/:campus', updateStudentCampus);
router.put('/results/reappear', updateReappearMarks);
router.put('/results/regular', updateRegularMarks);

// Base route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Pharmacy Results API' });
});