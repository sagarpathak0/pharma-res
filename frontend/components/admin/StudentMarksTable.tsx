import React, { useState } from 'react';
import { Result } from '@/types/student';

interface StudentMarksTableProps {
    yearData: Result;
    yearIndex: number;
    onMarksChange: (yearIndex: number, subjectIndex: number, newMarks: string) => void;
    changedSubjectCodes?: string[];
    originalData?: Result; // Add original data for reverting
}

// Validate marks - must be number between 0-100 or "A" or "UFM"
const validateMarks = (marks: string): { isValid: boolean; message?: string } => {
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

const StudentMarksTable: React.FC<StudentMarksTableProps> = ({ 
    yearData, 
    yearIndex, 
    onMarksChange,
    changedSubjectCodes = [],
    originalData
}) => {
    // Store local invalid state
    const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
    
    // Get the examination date from the first subject
    const examinationDate = yearData.marks.length > 0 ? yearData.marks[0].month_year : '';
    
    // Function to handle input change with validation
    const handleInputChange = (subjectIndex: number, newValue: string, courseCode: string) => {
        // First remove any invalid state if it exists
        if (invalidFields[courseCode]) {
            setInvalidFields(prev => {
                const updated = {...prev};
                delete updated[courseCode];
                return updated;
            });
        }
        
        // Update the parent component with the new value
        onMarksChange(yearIndex, subjectIndex, newValue);
    };
    
    // Function to validate on blur
    const handleBlur = (subjectIndex: number, value: string, courseCode: string) => {
        const validation = validateMarks(value);
        
        if (!validation.isValid) {
            // Mark as invalid
            setInvalidFields(prev => ({
                ...prev,
                [courseCode]: true
            }));
            
            // Show error message
            alert(`Invalid markss: ${validation.message}`);
            
            // Revert to original value if available
            if (originalData) {
                const originalValue = originalData.marks.find(m => m.course_code === courseCode)?.marks_obtained;
                if (originalValue) {
                    onMarksChange(yearIndex, subjectIndex, originalValue);
                }
            }
        }
    };
    
    return (
        <div className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold">Year {yearData.year} Results</h3>
                {examinationDate && (
                    <div className="text-sm text-gray-500">
                        Examination Date: <span className="font-medium">{examinationDate}</span>
                    </div>
                )}
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course Code
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course Name
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Marks <span className="text-blue-600">(editable)</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {yearData.marks.map((subject, subjectIndex) => {
                            const isChanged = changedSubjectCodes.includes(subject.course_code);
                            const isInvalid = invalidFields[subject.course_code];
                            
                            return (
                                <tr key={subject.course_code} className={`hover:bg-gray-50 ${isChanged ? 'bg-blue-50' : ''} ${isInvalid ? 'bg-red-50' : ''}`}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                        {subject.course_code}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                        {subject.course_name}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="text"
                                            value={subject.marks_obtained}
                                            onChange={(e) => handleInputChange(subjectIndex, e.target.value, subject.course_code)}
                                            onBlur={(e) => handleBlur(subjectIndex, e.target.value, subject.course_code)}
                                            className={`w-16 px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                isInvalid 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : isChanged 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-300'
                                            }`}
                                            title="Enter marks (0-100, A, or UFM)"
                                        />
                                        {isInvalid && (
                                            <span className="ml-2 text-xs text-red-600">Invalid</span>
                                        )}
                                        {isChanged && !isInvalid && (
                                            <span className="ml-2 text-xs text-blue-600">Changed</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentMarksTable;
