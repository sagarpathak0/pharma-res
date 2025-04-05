import { Router, Request, Response } from 'express';
import { getStudents, getFullStudentResult, getStudentByEnrollment } from '../models/Student';

export const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Pharmacy Results API' });
});

// Students list endpoint
router.get('/students', async (req: Request, res: Response) => {
  try {
    const students = await getStudents();
    res.json({ 
      success: true,
      message: 'Students fetched successfully',
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search student by enrollment
router.get('/students/search', async (req: Request, res: Response) => {
  try {
    const enrollmentNo = req.query.enrollment as string;
    
    if (!enrollmentNo) {
      return res.status(400).json({
        success: false,
        message: 'Enrollment number is required'
      });
    }
    
    const student = await getStudentByEnrollment(enrollmentNo);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const results = await getFullStudentResult(student.id);
    
    res.json({ 
      success: true,
      message: 'Student results fetched successfully',
      data: results
    });
  } catch (error) {
    console.error('Error searching student:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Student results endpoint
router.get('/students/:id/results', async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.id);
    const results = await getFullStudentResult(studentId);
    
    if (!results) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({ 
      success: true,
      message: 'Results fetched successfully',
      data: results
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
