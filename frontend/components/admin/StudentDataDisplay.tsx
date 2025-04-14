import React, { useState } from 'react';
import PersonalDetailsForm from './PersonalDetailsForm';
import StudentMarksTable from './StudentMarksTable';
import { Student, Subject } from '@/types/student';

interface StudentDataDisplayProps {
    studentData: Student;
    onSave: (updatedData: Student, updatedField: 'campus' | 'marks', changedSubjects?: Subject[]) => void;
    isSaving: boolean;
}

const StudentDataDisplay: React.FC<StudentDataDisplayProps> = ({ 
    studentData, 
    onSave,
    isSaving
}) => {
    // Store original data for reverting on invalid input
    const [originalData] = useState<Student>(JSON.parse(JSON.stringify(studentData)));
    // Current edited data
    const [editedData, setEditedData] = useState<Student>({...studentData});
    // Track changed campus
    const [isCampusChanged, setIsCampusChanged] = useState(false);
    // Track changed marks
    const [changedMarks, setChangedMarks] = useState<Subject[]>([]);
    
    // Handle campus update
    const handleCampusChange = (newCampus: string) => {
        setEditedData(prev => ({
            ...prev,
            campus: newCampus
        }));
        setIsCampusChanged(newCampus !== studentData.campus);
    };
    
    // Handle marks update
    const handleMarksChange = (yearIndex: number, subjectIndex: number, newMarks: string) => {
        const updatedResult = [...editedData.result];
        const subject = updatedResult[yearIndex].marks[subjectIndex];
        const originalValue = originalData.result[yearIndex].marks[subjectIndex].marks_obtained;
        
        // Create a copy of the subject with the updated mark
        const updatedSubject = {
            ...subject,
            marks_obtained: newMarks
        };
        
        // Update the result data
        updatedResult[yearIndex] = {
            ...updatedResult[yearIndex],
            marks: [...updatedResult[yearIndex].marks]
        };
        updatedResult[yearIndex].marks[subjectIndex] = updatedSubject;
        
        // Update the edited data
        setEditedData(prev => ({
            ...prev,
            result: updatedResult
        }));
        
        // If value equals original, remove from changedMarks
        if (newMarks === originalValue) {
            setChangedMarks(prev => 
                prev.filter(s => s.course_code !== subject.course_code)
            );
            return;
        }
        
        // Track this subject in changedMarks
        const existingIndex = changedMarks.findIndex(
            s => s.course_code === subject.course_code
        );
        
        if (existingIndex >= 0) {
            // Update existing entry
            const updatedChangedMarks = [...changedMarks];
            updatedChangedMarks[existingIndex] = updatedSubject;
            setChangedMarks(updatedChangedMarks);
        } else {
            // Add new entry
            setChangedMarks([...changedMarks, updatedSubject]);
        }
    };
    
    // Handle campus save button click
    const handleCampusSave = () => {
        onSave(editedData, 'campus');
        setIsCampusChanged(false);
    };
    
    // Handle marks save button click
    const handleMarksSave = () => {
        onSave(editedData, 'marks', changedMarks);
    };
    
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 pb-2 border-b">
                Student Data Management
            </h1>
            
            {/* Personal Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Personal Details</h2>
                    
                    {/* Campus Save Button */}
                    <button
                        type="button"
                        onClick={handleCampusSave}
                        disabled={!isCampusChanged || isSaving}
                        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm text-white font-medium ${
                            isCampusChanged && !isSaving 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                        } transition-colors`}
                    >
                        {isSaving ? 'Saving...' : 'Save Campus'}
                    </button>
                </div>
                <PersonalDetailsForm 
                    data={editedData}
                    onCampusChange={handleCampusChange}
                />
            </div>
            
            {/* Academic Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Academic Performance</h2>
                    
                    {/* Marks Save Button */}
                    <button
                        type="button"
                        onClick={handleMarksSave}
                        disabled={changedMarks.length === 0 || isSaving}
                        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm text-white font-medium ${
                            changedMarks.length > 0 && !isSaving 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                        } transition-colors`}
                    >
                        {isSaving ? 'Saving...' : `Save Marks (${changedMarks.length} changed)`}
                    </button>
                </div>
                <div className="p-4">
                    {editedData.result.map((yearResult, yearIndex) => (
                        <StudentMarksTable 
                            key={`year-${yearResult.year}`}
                            yearData={yearResult}
                            yearIndex={yearIndex}
                            onMarksChange={handleMarksChange}
                            changedSubjectCodes={changedMarks.map(s => s.course_code)}
                            originalData={originalData.result[yearIndex]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDataDisplay;
