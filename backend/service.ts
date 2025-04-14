import { processAndInsertResults, StudentResult } from './models';
import pool from './db';
import { 
  searchResultsQuery, 
  fetchAcademicYearsQuery, 
  updateCampusQuery, 
  updateMarksQuery, 
  checkMarkExistsQuery,
  getSubjectQuery
} from './queries';

interface Subject {
  course_code: string;
  course_name: string;
  marks_obtained: string;
  month_year: string;
}

interface Result {
  year: number;
  marks: Subject[];
}

interface Student {
  name: string;
  roll: number;
  campus: string;
  program: string;
  type: string;
  admission_year: string;
  result: Result[];
}

export async function insertResults(data: StudentResult[]) {
  try {
    return await processAndInsertResults(data);
  } catch (error) {
    console.error('Error in insertResults:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function searchResultsByRollNo(
  rollNo: string,
  academicYear: string,
  examType: string
): Promise<Student | null> {
  const client = await pool.connect();
  
  try {
    console.log('Searching with params:', { rollNo, examType, academicYear });
    const result = await client.query(searchResultsQuery, [rollNo, examType, academicYear]);
    
    if (result.rows.length === 0) {
      return null;
    }

    // Transform the data to match the Student interface
    const firstRow = result.rows[0];
    const transformedData: Student = {
      name: firstRow.name,
      roll: parseInt(firstRow.roll_number),
      campus: firstRow.campus,
      program: firstRow.program,
      type: examType,
      admission_year: firstRow.admission_year.toString(),
      result: [{
        year: firstRow.study_year,
        marks: result.rows.map(row => ({
          course_code: row.subject_code,
          course_name: row.subject_name,
          marks_obtained: row.marks_obtained.toString(),
          month_year: `${row.exam_month}, ${row.exam_year}`
        }))
      }]
    };

    return transformedData;

  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function fetchAcademicYearsByRollNo(rollNo: string): Promise<string[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(fetchAcademicYearsQuery, [rollNo]);
    return result.rows.map(row => row.academic_year);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCampus(rollNo: string, campus: string): Promise<boolean> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(updateCampusQuery, [rollNo, campus]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error updating campus:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateMarks(
  rollNo: string, 
  subjects: Array<{course_code: string, marks_obtained: string}>,
  examMonth: string,
  examYear: number,
  examType: 'Regular' | 'Reappear'
): Promise<{success: boolean, message: string}> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    for (const subject of subjects) {
      // Get subject info to determine year
      const subjectInfo = await client.query(getSubjectQuery, [subject.course_code]);
      
      if (subjectInfo.rows.length === 0) {
        await client.query('ROLLBACK');
        return { 
          success: false, 
          message: `Subject ${subject.course_code} not found` 
        };
      }
      
      const subjectYear = subjectInfo.rows[0].year;
      
      // Generate exam ID based on format in existing code
      const shortMonth = examMonth.substring(0, 3).toUpperCase();
      const shortYear = examYear.toString().substring(2);
      const examTypeCode = examType === 'Regular' ? 'R' : 'RP';
      const yearLabel = `Y${subjectYear}`;
      const examId = `${examTypeCode}_${shortMonth}_${shortYear}_${yearLabel}`;
      
      // Check if mark exists
      const checkResult = await client.query(checkMarkExistsQuery, [
        rollNo, subject.course_code, examId
      ]);
      
      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return { 
          success: false, 
          message: `Mark entry for ${subject.course_code} not found` 
        };
      }
      
      // Update marks
      const marksObtained = parseFloat(subject.marks_obtained);
      if (isNaN(marksObtained) || marksObtained < 0 || marksObtained > 100) {
        await client.query('ROLLBACK');
        return { 
          success: false, 
          message: `Invalid marks ${subject.marks_obtained} for ${subject.course_code}` 
        };
      }
      
      // Calculate grade and pass/fail
      const grade = calculateGrade(marksObtained);
      const passFail = marksObtained >= 40;
      
      await client.query(updateMarksQuery, [
        rollNo, 
        subject.course_code, 
        examId,
        marksObtained,
        grade,
        passFail
      ]);
    }
    
    await client.query('COMMIT');
    return { success: true, message: 'Marks updated successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating marks:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  } finally {
    client.release();
  }
}

// Helper function to calculate grade (copy from models.ts)
function calculateGrade(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C+';
  if (marks >= 40) return 'C';
  return 'F';
}