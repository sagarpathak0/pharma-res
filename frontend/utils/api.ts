import axios from "axios";
import { Subject } from "../types/student";

interface SearchParams {
  rollNumber: string;
  academicYear: string;
  examType: string;
}

// Function to search for student results
export const searchStudentResults = async (params: SearchParams) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/results/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch results");
  }

  return result;
};

// Function to update student campus
export const updateStudentCampus = async (rollNumber: number, newCampus: string) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/students/${rollNumber}/${encodeURIComponent(newCampus)}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update regular exam marks
export const updateRegularMarks = async (
  rollNumber: number,
  subjects: Subject[],
  examMonth: string,
  examYear: string
) => {
  try {
    const payload = {
      rollNumber: rollNumber.toString(),
      subjects: subjects.map(subject => ({
        course_code: subject.course_code,
        marks_obtained: subject.marks_obtained
      })),
      examMonth,
      examYear
    };
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/results/regular`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update reappear exam marks
export const updateReappearMarks = async (
  rollNumber: number,
  subjects: Subject[],
  examMonth: string,
  examYear: string
) => {
  try {
    const payload = {
      rollNumber: rollNumber.toString(),
      subjects: subjects.map(subject => ({
        course_code: subject.course_code,
        marks_obtained: subject.marks_obtained
      })),
      examMonth,
      examYear
    };
    
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/results/reappear`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
