import pool from './db';
import { 
  insertStudentQuery,
  insertSubjectQuery,
  insertExamQuery,
  insertMarksQuery,
  checkExistingMarksQuery
} from './queries';

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

// Add to top of file with other interfaces
export interface StudentResult {
  name: string;
  roll: string;
  campus: string;
  program: string;
  admission_year: string;
  result: Array<{
    marks: Array<{
      course_code: string;
      course_name: string;
      marks_obtained: string;
      month_year: string;
    }>;
    year: number;
  }>;
}

// Make sure to update the exports at top of file:
// Removed redundant export statement to avoid conflicts

// Add this check before inserting marks
async function checkExistingMarks(client: any, rollNo: string, subjectCode: string, examId: string): Promise<boolean> {
  const result = await client.query(checkExistingMarksQuery, [rollNo, subjectCode, examId]);
  return result.rows.length > 0;
}

function validateExamMonth(month: string): boolean {
  const validMonths = ['June', 'December'];
  return validMonths.includes(month);
}

// Modify the processAndInsertResults function to include the check
export async function processAndInsertResults(data: StudentResult[]): Promise<{ success: boolean; message: string }> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    for (const student of data) {
      // Insert student
      await client.query(insertStudentQuery, [
        student.roll,
        student.name,
        student.campus,
        student.program,
        parseInt(student.admission_year),
      ]);

      for (const resultSet of student.result) {
        for (const mark of resultSet.marks) {
          // Generate exam_id
          const [month, yearStr] = mark.month_year.split(", ");
          const shortMonth = month.substring(0, 3).toUpperCase();
          const shortYear = yearStr.substring(2);
          const examType = 'R';
          const yearLabel = `Y${resultSet.year}`;
          const exam_id = `${examType}_${shortMonth}_${shortYear}_${yearLabel}`;

          // Check for duplicates
          const exists = await checkExistingMarks(client, student.roll.toString(), mark.course_code, exam_id);
          if (exists) {
            await client.query('ROLLBACK');
            return {
              success: false,
              message: `Duplicate entry found for Roll No: ${student.roll}, Subject: ${mark.course_code}`
            };
          }

          // Insert subject
          await client.query(insertSubjectQuery, [
            mark.course_code,
            mark.course_name,
            resultSet.year
          ]);

          // Insert exam
          await client.query(insertExamQuery, [
            exam_id,
            'Regular',
            month,
            parseInt(yearStr),
            resultSet.year
          ]);

          // Process marks
          const marksObtained = parseFloat(mark.marks_obtained);
          const maxMarks = 100;
          const grade = calculateGrade(marksObtained);
          const passFail = marksObtained >= 40;

          // Insert marks
          await client.query(insertMarksQuery, [
            student.roll.toString(),
            mark.course_code,
            exam_id,
            marksObtained,
            maxMarks,
            grade,
            passFail,
            resultSet.year
          ]);
        }
      }
    }

    await client.query('COMMIT');
    return {
      success: true,
      message: 'All data inserted successfully'
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in processAndInsertResults:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  } finally {
    client.release();
  }
}

// Add these helper functions
function validateMarks(marks: number): boolean {
  return !isNaN(marks) && marks >= 0 && marks <= 100;
}

function handleDatabaseError(error: unknown): { success: false; message: string } {
  if (error instanceof Error) {
    if (error.message.includes('foreign key constraint')) {
      return {
        success: false,
        message: 'Invalid reference: Check if all required records exist'
      };
    }
    if (error.message.includes('unique constraint')) {
      return {
        success: false,
        message: 'Duplicate entry found'
      };
    }
    return {
      success: false,
      message: error.message
    };
  }
  return {
    success: false,
    message: 'Unknown error occurred'
  };
}

function calculateGrade(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C+';
  if (marks >= 40) return 'C';
  return 'F';
}
