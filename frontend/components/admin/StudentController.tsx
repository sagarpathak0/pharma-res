import React, { useState } from 'react';
import { Student, Subject } from '@/types/student';
import { updateStudentCampus, updateRegularMarks, updateReappearMarks } from '@/utils/api';
import { validateSubjects, extractMonthYear } from '@/utils/validation';
import StudentDataDisplay from './StudentDataDisplay';
import axios from 'axios';

interface StudentControllerProps {
  studentData: Student;
  onRefresh: () => Promise<void>;
}

const StudentController: React.FC<StudentControllerProps> = ({ 
  studentData, 
  onRefresh
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // Function to handle campus update
  const handleCampusUpdate = async (student: Student, newCampus: string) => {
    setIsSaving(true);
    console.log("Updating campus for student:", student.roll, "New campus:", newCampus);
    
    try {
      const result = await updateStudentCampus(student.roll, newCampus);
      
      if (result.success) {
        console.log("Campus updated successfully");
        alert("Campus updated successfully");
        await onRefresh();
      } else {
        throw new Error(result.message || "Failed to update campus");
      }
      
    } catch (error) {
      console.error("Error updating campus:", error);
      
      let errorMessage = "Error updating campus.";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.data.message || error.response.status}`;
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle marks update
  const handleMarksUpdate = async (student: Student, changedMarks: Subject[]) => {
    setIsSaving(true);
    
    try {
      // Don't proceed if there are no changes
      if (changedMarks.length === 0) {
        alert("No changes detected. Nothing to update.");
        setIsSaving(false);
        return;
      }
      
      // Validate the marks
      const validation = validateSubjects(changedMarks);
      if (!validation.isValid) {
        alert(validation.errorMessage);
        setIsSaving(false);
        return;
      }
      
      // Get a reference subject for date extraction
      const allSubjects = student.result.flatMap(year => year.marks);
      if (allSubjects.length === 0) {
        throw new Error("No subjects found");
      }
      
      // Extract month and year
      const { month, year, isValid } = extractMonthYear(allSubjects[0].month_year);
      if (!isValid) {
        throw new Error("Invalid month_year format. Expected 'Month, Year'");
      }
      
      // Determine which API to call based on exam type
      let result;
      if (student.type.toLowerCase() === 'regular') {
        result = await updateRegularMarks(student.roll, changedMarks, month, year);
      } else if (student.type.toLowerCase() === 'reappear') {
        result = await updateReappearMarks(student.roll, changedMarks, month, year);
      } else {
        throw new Error(`Unknown exam type: ${student.type}`);
      }
      
      if (result.success) {
        console.log(`${student.type} marks updated successfully`);
        alert(`${student.type} marks updated successfully`);
        await onRefresh();
      } else {
        throw new Error(result.message || `Failed to update ${student.type} marks`);
      }
      
    } catch (error) {
      console.error("Error updating marks:", error);
      
      let errorMessage = "Error updating marks.";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server error: ${error.response.data.message || error.response.status}`;
        } else if (error.request) {
          errorMessage = "No response from server. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for all data saving
  const handleSaveData = async (
    updatedData: Student, 
    updatedField: 'campus' | 'marks', 
    changedSubjects?: Subject[]
  ) => {
    if (updatedField === 'campus') {
      await handleCampusUpdate(updatedData, updatedData.campus);
    } else if (updatedField === 'marks' && changedSubjects) {
      await handleMarksUpdate(updatedData, changedSubjects);
    }
  };

  return (
    <StudentDataDisplay 
      studentData={studentData} 
      onSave={handleSaveData}
      isSaving={isSaving}
    />
  );
};

export default StudentController;
