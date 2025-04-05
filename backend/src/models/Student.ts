import pool from '../db';

// Interfaces matching your existing database tables
export interface Student {
  roll_no: string;
  student_name: string;
  program: string;
  campus: string;
}

export interface Course {
  course_code: string;
  course_name: string;
  year: number;
}

export interface Result {
  roll_no: string;
  course_code: string;
  month_year: string;
  acad_year: string;
  marks: string;
}

// Renamed to clarify this is not a real table but an aggregated model
export interface StudentAggregate {
  student: Student;
  results: Result[];
  totals: {
    maxMarks: number;
    marksObtained: number;
  };
  result: string;
}

export async function getStudents(): Promise<Student[]> {
  const query = 'SELECT * FROM student ORDER BY student_name';
  const result = await pool.query(query);
  return result.rows;
}

export async function getStudentByRollNo(rollNo: string): Promise<Student | null> {
  const result = await pool.query('SELECT * FROM student WHERE roll_no = $1', [rollNo]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getResultsByRollNo(rollNo: string): Promise<Result[]> {
  const result = await pool.query(
    'SELECT * FROM result WHERE roll_no = $1 ORDER BY course_code',
    [rollNo]
  );
  return result.rows;
}

// Rename return type from StudentResult to StudentAggregate
export async function getFullStudentResult(rollNo: string): Promise<StudentAggregate | null> {
  const student = await getStudentByRollNo(rollNo);
  if (!student) return null;

  const results = await getResultsByRollNo(rollNo);

  // Calculate totals
  const totals = results.reduce(
    (acc, result) => {
      const marks = parseInt(result.marks, 10);
      if (!isNaN(marks)) {
        acc.maxMarks += 100; // Assuming max marks for each course is 100
        acc.marksObtained += marks;
      }
      return acc;
    },
    { maxMarks: 0, marksObtained: 0 }
  );

  // Determine result
  const percentage = (totals.marksObtained / totals.maxMarks) * 100;
  let result = 'FAIL';

  // Count failing courses
  const failingCourses = results.filter(result => {
    const marks = parseInt(result.marks, 10);
    return !isNaN(marks) && marks < 50; // Assuming passing marks is 50
  });

  if (failingCourses.length > 2) {
    result = 'FAIL';
  } else {
    if (percentage >= 75) result = 'PASS WITH DISTINCTION';
    else if (percentage >= 60) result = 'PASS WITH FIRST DIVISION';
    else if (percentage >= 50) result = 'PASS';
  }

  return {
    student,
    results,
    totals,
    result
  };
}

// Add this function to allow creating a new student
export async function createStudent(student: Omit<Student, 'roll_no'>): Promise<Student> {
  const query = `
    INSERT INTO student (roll_no, student_name, program, campus)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  // Generate a roll_no any way you prefer, e.g., a random or sequential ID
  const rollNo = 'R_' + Math.floor(Math.random() * 1000000);
  const values = [rollNo, student.student_name, student.program, student.campus];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Add this function to allow inserting a course result
export async function addCourseResult(rollNo: string, courseCode: string, marksObtained: number): Promise<Result> {
  const query = `
    INSERT INTO result (roll_no, course_code, marks, month_year, acad_year)
    VALUES ($1, $2, $3, 'N/A', 'N/A')
    RETURNING *
  `;
  const values = [rollNo, courseCode, marksObtained];
  
  const inserted = await pool.query(query, values);
  return inserted.rows[0];
}
