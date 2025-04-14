export const checkExistingMarksQuery = `
  SELECT roll_number, subject_code, exam_id 
  FROM "Marks" 
  WHERE roll_number = $1 AND subject_code = $2 AND exam_id = $3;
`;

// First, add queries for inserting into each table
export const insertStudentQuery = `
  INSERT INTO "Student" (roll_number, name, campus, program, admission_year)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (roll_number) DO UPDATE SET
    name = EXCLUDED.name,
    campus = EXCLUDED.campus,
    program = EXCLUDED.program,
    admission_year = EXCLUDED.admission_year;
`;

export const insertSubjectQuery = `
  INSERT INTO "Subject" (subject_code, subject_name, year)
  VALUES ($1, $2, $3)
  ON CONFLICT (subject_code) DO UPDATE SET
    subject_name = EXCLUDED.subject_name,
    year = EXCLUDED.year;
`;

export const insertExamQuery = `
  INSERT INTO "Exam" (exam_id, exam_type, exam_month, exam_year, year)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (exam_id) DO NOTHING;
`;

// Keep existing marks query
export const insertMarksQuery = `
  INSERT INTO "Marks" (
    roll_number,
    subject_code,
    exam_id,
    marks_obtained,
    max_marks,
    grade,
    pass_fail,
    subject_year
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (roll_number, subject_code, exam_id) 
  DO UPDATE SET
    marks_obtained = EXCLUDED.marks_obtained,
    max_marks = EXCLUDED.max_marks,
    grade = EXCLUDED.grade,
    pass_fail = EXCLUDED.pass_fail,
    subject_year = EXCLUDED.subject_year;
`;

// Update campus information
export const updateCampusQuery = `
  UPDATE "Student"
  SET campus = $2
  WHERE roll_number = $1
  RETURNING *;
`;

// Update marks (for both regular and reappear)
export const updateMarksQuery = `
  UPDATE "Marks"
  SET marks_obtained = $4,
      grade = $5,
      pass_fail = $6
  WHERE roll_number = $1
    AND subject_code = $2
    AND exam_id = $3
  RETURNING *;
`;

// Check if mark entry exists
export const checkMarkExistsQuery = `
  SELECT * FROM "Marks"
  WHERE roll_number = $1
    AND subject_code = $2
    AND exam_id = $3;
`;

// Get subject information
export const getSubjectQuery = `
  SELECT * FROM "Subject"
  WHERE subject_code = $1;
`;

export const searchResultsQuery = `
  WITH academic_year_calc AS (
    SELECT m.*, s.name, s.program, s.campus, s.admission_year,
           sub.subject_name, e.exam_type, e.exam_month, e.exam_year,
           (e.exam_year - s.admission_year + 1) as study_year,
           CASE 
             WHEN e.exam_month = 'June' THEN 
               CONCAT(s.admission_year, '-', s.admission_year + 1)
             WHEN e.exam_month = 'December' THEN
               CONCAT(s.admission_year, '-', s.admission_year + 1)
           END as academic_year
    FROM "Marks" m
    JOIN "Student" s ON m.roll_number = s.roll_number
    JOIN "Subject" sub ON m.subject_code = sub.subject_code
    JOIN "Exam" e ON m.exam_id = e.exam_id
    WHERE m.roll_number = $1 
    AND e.exam_type = $2
    AND m.subject_year <= 4
  )
  SELECT *
  FROM academic_year_calc
  WHERE academic_year = $3
  ORDER BY subject_code;
`;

export const fetchAcademicYearsQuery = `
  WITH student_years AS (
    SELECT DISTINCT 
      s.admission_year,
      e.exam_year,
      e.exam_month,
      CONCAT(
        CASE 
          WHEN e.exam_month = 'June' THEN e.exam_year - 1
          WHEN e.exam_month = 'December' THEN e.exam_year
        END,
        '-',
        CASE 
          WHEN e.exam_month = 'June' THEN e.exam_year
          WHEN e.exam_month = 'December' THEN e.exam_year + 1
        END
      ) as academic_year
    FROM "Student" s
    JOIN "Marks" m ON s.roll_number = m.roll_number
    JOIN "Exam" e ON m.exam_id = e.exam_id
    WHERE s.roll_number = $1
  )
  SELECT academic_year
  FROM student_years
  ORDER BY exam_year;
`;