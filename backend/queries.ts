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