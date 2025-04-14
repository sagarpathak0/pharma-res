import { Subject } from "../types/student";

// Validate marks - must be number between 0-100 or "A" or "UFM"
export const validateMarks = (marks: string): { isValid: boolean; message?: string } => {
  // If marks is "A" or "UFM", it's valid
  if (marks === "A" || marks === "UFM") {
    return { isValid: true };
  }
  
  // Try to parse as number
  const numericMarks = parseFloat(marks);
  if (isNaN(numericMarks)) {
    return { 
      isValid: false, 
      message: "Marks must be a number between 0-100, or 'A', or 'UFM'" 
    };
  }
  
  // Check if in range 0-100
  if (numericMarks < 0 || numericMarks > 100) {
    return { 
      isValid: false, 
      message: "Marks must be between 0 and 100" 
    };
  }
  
  return { isValid: true };
};

// Validate a collection of subjects
export const validateSubjects = (subjects: Subject[]): { 
  isValid: boolean;
  invalidSubjects: Subject[];
  errorMessage?: string;
} => {
  const invalidSubjects: Subject[] = [];
  
  for (const subject of subjects) {
    const validation = validateMarks(subject.marks_obtained);
    if (!validation.isValid) {
      invalidSubjects.push(subject);
    }
  }
  
  if (invalidSubjects.length > 0) {
    let errorMessage = "Invalid marks detected:\n";
    invalidSubjects.forEach(subject => {
      const validation = validateMarks(subject.marks_obtained);
      errorMessage += `- ${subject.course_name}: ${validation.message}\n`;
    });
    
    return {
      isValid: false,
      invalidSubjects,
      errorMessage
    };
  }
  
  return {
    isValid: true,
    invalidSubjects: []
  };
};

// Extract month and year from date string
export const extractMonthYear = (monthYearStr: string): { 
  month: string;
  year: string;
  isValid: boolean;
} => {
  const monthYearParts = monthYearStr.split(", ");
  if (monthYearParts.length !== 2) {
    return {
      month: "",
      year: "",
      isValid: false
    };
  }
  
  return {
    month: monthYearParts[0],
    year: monthYearParts[1],
    isValid: true
  };
};
