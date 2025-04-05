-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  enrollment_no VARCHAR(50) NOT NULL UNIQUE,
  year VARCHAR(50) NOT NULL,
  campus_name VARCHAR(255) NOT NULL
);

-- Course Results table
CREATE TABLE IF NOT EXISTS course_results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  course_code VARCHAR(50) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  max_marks INTEGER NOT NULL,
  marks_obtained INTEGER NOT NULL,
  CONSTRAINT fk_student 
    FOREIGN KEY(student_id) 
    REFERENCES students(id)
    ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_student_id ON course_results(student_id);
CREATE INDEX idx_enrollment_no ON students(enrollment_no);
