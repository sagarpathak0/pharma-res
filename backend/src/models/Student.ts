import pool from '../db';

// Interfaces updated to match the new tables
export interface Student {
  roll_number: string;
  name: string;
  campus: string;
  program: string;
  admission_year: number;
}

export interface Subject {
  subject_code: string;
  subject_name: string;
  year: number;
}

export interface Exam {
  exam_id: string;
  exam_type: 'Regular' | 'Reappear';
  exam_month: 'June' | 'December';
  exam_year: number;
  year: number; // Academic year of the students giving this exam
}

export interface Marks {
  roll_number: string;
  subject_code: string;
  exam_id: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  pass_fail: boolean;
  subject_year: number;
}

// Aggregated student result - not a table but a composed structure
export interface StudentAggregate {
  student: Student;
  marks: Marks[];
  examInfo: Exam[];
  subjects: Subject[];
  totals: {
    maxMarks: number;
    marksObtained: number;
  };
  result: string;
}

// Fetch all students
export async function getStudents(): Promise<Student[]> {
  const query = 'SELECT * FROM "Student" ORDER BY name';
  const result = await pool.query(query);
  return result.rows;
}

// Fetch student by roll number
export async function getStudentByRollNo(rollNumber: string): Promise<Student | null> {
  const query = 'SELECT * FROM "Student" WHERE roll_number = $1';
  const result = await pool.query(query, [rollNumber]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Get student marks for a specific exam or all exams
export async function getStudentMarks(rollNumber: string, examId?: string): Promise<Marks[]> {
  let query = 'SELECT * FROM "Marks" WHERE roll_number = $1';
  const params = [rollNumber];
  
  if (examId) {
    query += ' AND exam_id = $2';
    params.push(examId);
  }
  
  query += ' ORDER BY subject_code';
  const result = await pool.query(query, params);
  return result.rows;
}

// Get subject details
export async function getSubject(subjectCode: string): Promise<Subject | null> {
  const query = 'SELECT * FROM "Subject" WHERE subject_code = $1';
  const result = await pool.query(query, [subjectCode]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Get exam details
export async function getExam(examId: string): Promise<Exam | null> {
  const query = 'SELECT * FROM "Exam" WHERE exam_id = $1';
  const result = await pool.query(query, [examId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Get full student results including all related data
export async function getFullStudentResult(rollNumber: string): Promise<StudentAggregate | null> {
  const student = await getStudentByRollNo(rollNumber);
  if (!student) return null;

  const marks = await getStudentMarks(rollNumber);
  
  // Get unique exam IDs and subject codes
  const examIds = [...new Set(marks.map(mark => mark.exam_id))];
  const subjectCodes = [...new Set(marks.map(mark => mark.subject_code))];
  
  // Fetch exam info
  const examPromises = examIds.map(examId => getExam(examId));
  const examResults = await Promise.all(examPromises);
  const examInfo = examResults.filter(Boolean) as Exam[];
  
  // Fetch subjects
  const subjectPromises = subjectCodes.map(code => getSubject(code));
  const subjectResults = await Promise.all(subjectPromises);
  const subjects = subjectResults.filter(Boolean) as Subject[];
  
  // Calculate totals
  const totals = marks.reduce(
    (acc, mark) => {
      if (mark.max_marks && mark.marks_obtained) {
        acc.maxMarks += mark.max_marks;
        acc.marksObtained += mark.marks_obtained;
      }
      return acc;
    },
    { maxMarks: 0, marksObtained: 0 }
  );
  
  // Determine result
  const percentage = totals.maxMarks > 0 ? (totals.marksObtained / totals.maxMarks) * 100 : 0;
  let result = 'FAIL';
  
  // Count failing marks
  const failingMarks = marks.filter(mark => mark.pass_fail === false);
  
  if (failingMarks.length > 2) {
    result = 'FAIL';
  } else {
    if (percentage >= 75) result = 'PASS WITH DISTINCTION';
    else if (percentage >= 60) result = 'PASS WITH FIRST DIVISION';
    else if (percentage >= 50) result = 'PASS';
    else result = 'FAIL';
  }

  return {
    student,
    marks,
    examInfo,
    subjects,
    totals,
    result
  };
}

// Create a new student
export async function createStudent(student: Omit<Student, 'roll_number'> & { roll_number?: string }): Promise<Student> {
  // Generate roll number if not provided
  const roll_number = student.roll_number || `R_${Date.now().toString().slice(-8)}`;
  
  const query = `
    INSERT INTO "Student" (roll_number, name, campus, program, admission_year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const values = [roll_number, student.name, student.campus, student.program, student.admission_year];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Add a course result (mark)
export async function addCourseResult(
  rollNumber: string, 
  subjectCode: string, 
  marksObtained: number, 
  examId: string,
  maxMarks: number = 100,
  subjectYear: number = 1
): Promise<Marks> {
  // Calculate grade and pass/fail status
  const percentage = (marksObtained / maxMarks) * 100;
  let grade = 'F';
  
  if (percentage >= 75) grade = 'A+';
  else if (percentage >= 60) grade = 'A';
  else if (percentage >= 50) grade = 'B';
  else if (percentage >= 40) grade = 'C';
  
  const pass_fail = percentage >= 40;
  
  const query = `
    INSERT INTO "Marks" (roll_number, subject_code, exam_id, marks_obtained, max_marks, grade, pass_fail, subject_year)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const values = [
    rollNumber, 
    subjectCode, 
    examId, 
    marksObtained, 
    maxMarks, 
    grade, 
    pass_fail,
    subjectYear
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}
