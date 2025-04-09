import { processAndInsertResults, StudentResult } from './models';
import pool from './db';
import { searchResultsQuery } from './queries';

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
  examType: string,
  academicYear: string
): Promise<any> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(searchResultsQuery, [rollNo, examType]);

    if (result.rows.length === 0) {
      return null;
    }

    // Filter results by academic year
    const filteredRows = result.rows.filter(row => row.academic_year === academicYear);

    // Group results by semester/year
    const groupedResults = filteredRows.reduce((acc: any, row: any) => {
      const yearKey = row.study_year;
      
      if (!acc[yearKey]) {
        acc[yearKey] = {
          academic_year: row.academic_year,
          year: yearKey,
          exam_type: row.exam_type,
          exam_month: row.exam_month,
          student_info: {
            name: row.name,
            roll_number: row.roll_number,
            program: row.program,
            campus: row.campus
          },
          subjects: []
        };
      }

      acc[yearKey].subjects.push({
        subject_code: row.subject_code,
        subject_name: row.subject_name,
        marks_obtained: row.marks_obtained,
        max_marks: row.max_marks,
        grade: row.grade,
        pass_fail: row.pass_fail
      });

      return acc;
    }, {});

    return Object.values(groupedResults);

  } catch (error) {
    console.error('Error in searchResultsByRollNo:', error);
    throw error;
  } finally {
    client.release();
  }
}