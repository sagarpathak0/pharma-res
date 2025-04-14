import React from 'react';
import { Result } from '@/types/student';

interface StudentMarksTableProps {
    yearData: Result;
    yearIndex: number;
    onMarksChange: (yearIndex: number, subjectIndex: number, newMarks: string) => void;
    changedSubjectCodes?: string[];
}

const StudentMarksTable: React.FC<StudentMarksTableProps> = ({ 
    yearData, 
    yearIndex, 
    onMarksChange,
    changedSubjectCodes = []
}) => {
    // Get the examination date from the first subject
    const examinationDate = yearData.marks.length > 0 ? yearData.marks[0].month_year : '';
    
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
                            
                            return (
                                <tr key={subject.course_code} className={`hover:bg-gray-50 ${isChanged ? 'bg-blue-50' : ''}`}>
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
                                            onChange={(e) => onMarksChange(yearIndex, subjectIndex, e.target.value)}
                                            className={`w-16 px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                isChanged 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        {isChanged && (
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
