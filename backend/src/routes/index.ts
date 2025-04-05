import { Router, Request, Response } from 'express';
import { 
  getStudents, 
  getFullStudentResult, 
  getStudentByRollNo, 
  createStudent,
  addCourseResult 
} from '../models/Student';

export const router = Router();

// Welcome endpoint
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

// Search student by roll number
router.get('/students/search', async (req: Request, res: Response) => {
  try {
    const rollNo = req.query.roll_no as string;
    
    if (!rollNo) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }
    
    const student = await getStudentByRollNo(rollNo);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const results = await getFullStudentResult(rollNo);
    
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
router.get('/students/:roll_no/results', async (req: Request, res: Response) => {
  try {
    const rollNo = req.params.roll_no;
    const results = await getFullStudentResult(rollNo);
    
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

// Create new student
router.post('/students', async (req: Request, res: Response) => {
  try {
    const { name, enrollment_no, year, campus_name } = req.body;
    
    if (!name || !enrollment_no || !year || !campus_name) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, enrollment_no, year, campus_name'
      });
    }
    
    const newStudent = await createStudent({
      student_name: name,
      program: year, 
      campus: campus_name
    });
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add course result
router.post('/students/:roll_no/results', async (req: Request, res: Response) => {
  try {
    const rollNo = req.params.roll_no;
    const { course_code, course_name, max_marks, marks_obtained } = req.body;
    
    if (!course_code || !course_name || !max_marks || marks_obtained === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: course_code, course_name, max_marks, marks_obtained'
      });
    }

    const courseResult = await addCourseResult(rollNo, course_code, marks_obtained);

    res.status(201).json({
      success: true,
      message: 'Course result added successfully',
      data: courseResult
    });
  } catch (error) {
    console.error('Error adding course result:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding course result',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

