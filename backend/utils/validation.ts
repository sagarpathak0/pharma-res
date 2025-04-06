export function validateStudentData(student: any): string | null {
  if (!student.name || typeof student.name !== 'string') {
    return 'Invalid or missing student name';
  }

  if (!student.roll || typeof student.roll !== 'number') {
    return 'Invalid or missing roll number';
  }

  if (!student.campus || typeof student.campus !== 'string') {
    return 'Invalid or missing campus';
  }

  if (!student.program || typeof student.program !== 'string') {
    return 'Invalid or missing program';
  }

  if (!Array.isArray(student.result) || student.result.length === 0) {
    return 'Invalid or missing results';
  }

  for (const result of student.result) {
    if (!Array.isArray(result.marks) || result.marks.length === 0) {
      return 'Invalid or missing marks data';
    }

    if (typeof result.year !== 'number') {
      return 'Invalid or missing year';
    }

    for (const mark of result.marks) {
      if (!mark.course_code || !mark.course_name || !mark.marks_obtained || !mark.month_year) {
        return 'Invalid or missing mark details';
      }
    }
  }

  return null;
}