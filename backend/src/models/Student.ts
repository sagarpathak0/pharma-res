import pool from '../db';

// Interfaces that should match your existing database structure
export interface Student {
  id: number;
  name: string;
  enrollment_no: string;
  year: string;
  campus_name: string;
  // Add any additional fields from your existing schema
}

export interface CourseResult {
  id: number;
  student_id: number;
  course_code: string;
  course_name: string;
  max_marks: number;
  marks_obtained: number;
  // Add any additional fields from your existing schema
}

export interface StudentResult {
  student: Student;
  courses: CourseResult[];
  totals: {
    maxMarks: number;
    marksObtained: number;
  };
  result: string;
}

export async function getStudents(): Promise<Student[]> {
  // Adjust query to match your existing table/column names
  const query = 'SELECT * FROM students';
  const result = await pool.query(query);
  return result.rows;
}

export async function getStudentByEnrollment(enrollmentNo: string): Promise<Student | null> {
  // Added this method to search by enrollment number
  const result = await pool.query('SELECT * FROM students WHERE enrollment_no = $1', [enrollmentNo]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getStudentById(id: number): Promise<Student | null> {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getStudentResults(studentId: number): Promise<CourseResult[]> {
  // Adjust query to match your existing table/column names
  const result = await pool.query(
    'SELECT * FROM course_results WHERE student_id = $1 ORDER BY id',
    [studentId]
  );
  return result.rows;
}

export async function getFullStudentResult(studentId: number): Promise<StudentResult | null> {
  const student = await getStudentById(studentId);
  if (!student) return null;
  
  const courses = await getStudentResults(studentId);
  
  // Calculate totals (exclude any special courses if needed)
  const totals = courses.reduce(
    (acc, course) => {
      // You might want to exclude certain courses from total calculation
      // For example, soft skills modules
      if (!course.course_code.includes('HF')) { // Assuming HF in code indicates modules to exclude
        acc.maxMarks += course.max_marks;
        acc.marksObtained += course.marks_obtained;
      }
      return acc;
    },
    { maxMarks: 0, marksObtained: 0 }
  );
  
  // Determine result
  const percentage = (totals.marksObtained / totals.maxMarks) * 100;
  let result = 'FAIL';
  
  // Count failing courses
  const failingCourses = courses.filter(course => {
    const percentage = (course.marks_obtained / course.max_marks) * 100;
    return percentage < 50;
  });
  
  // Apply result rules - adjust these to match your grading system
  if (failingCourses.length > 2) {
    result = 'FAIL';
  } else {
    if (percentage >= 75) result = 'PASS WITH DISTINCTION';
    else if (percentage >= 60) result = 'PASS WITH FIRST DIVISION';
    else if (percentage >= 50) result = 'PASS';
    else result = 'FAIL';
  }
  
  return {
    student,
    courses,
    totals,
    result
  };
}
