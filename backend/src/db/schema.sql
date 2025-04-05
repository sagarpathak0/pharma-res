-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Marks" CASCADE;
DROP TABLE IF EXISTS "Exam" CASCADE;
DROP TABLE IF EXISTS "Subject" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;

CREATE TABLE "Student" (
  roll_number VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  campus VARCHAR(100) NOT NULL,
  program VARCHAR(100) NOT NULL,
  admission_year INT NOT NULL
);

CREATE TABLE "Subject" (
  subject_code VARCHAR(20) PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL,
  year INT NOT NULL
);

CREATE TABLE "Exam" (
  exam_id VARCHAR(30) PRIMARY KEY,
  exam_type VARCHAR(10) CHECK (exam_type IN ('Regular','Reappear')) NOT NULL,
  exam_month VARCHAR(10) CHECK (exam_month IN ('June','December')) NOT NULL,
  exam_year INT NOT NULL,
  year INT NOT NULL,
  UNIQUE (exam_type, exam_month, exam_year, year)
);

CREATE TABLE "Marks" (
  roll_number VARCHAR(20),
  subject_code VARCHAR(20),
  exam_id VARCHAR(30),
  marks_obtained FLOAT,
  max_marks INT NOT NULL,
  grade VARCHAR(10),
  pass_fail BOOLEAN,
  subject_year INT NOT NULL,
  PRIMARY KEY (roll_number, subject_code, exam_id),
  FOREIGN KEY (roll_number) REFERENCES "Student"(roll_number),
  FOREIGN KEY (subject_code) REFERENCES "Subject"(subject_code),
  FOREIGN KEY (exam_id) REFERENCES "Exam"(exam_id)
);
