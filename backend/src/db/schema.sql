-- Drop existing tables if they exist
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS course_results CASCADE;

-- Student table
CREATE TABLE IF NOT EXISTS student (
  roll_no VARCHAR(50) PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  program VARCHAR(50) NOT NULL,
  campus VARCHAR(255) NOT NULL
);

-- Course table
CREATE TABLE IF NOT EXISTS course (
  course_code VARCHAR(50) PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  year INT NOT NULL
);

-- Result table
CREATE TABLE IF NOT EXISTS result (
  roll_no VARCHAR(50),
  course_code VARCHAR(50),
  month_year VARCHAR(50) NOT NULL,
  acad_year VARCHAR(50) NOT NULL,
  marks VARCHAR(10),
  CONSTRAINT fk_roll_no FOREIGN KEY(roll_no) REFERENCES student(roll_no) ON DELETE CASCADE,
  CONSTRAINT fk_course_code FOREIGN KEY(course_code) REFERENCES course(course_code) ON DELETE CASCADE
);
