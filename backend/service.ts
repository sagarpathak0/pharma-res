import { processAndInsertResults, StudentResult } from './models';
import pool from './db';
import { searchResultsQuery, fetchAcademicYearsQuery } from './queries';

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