import React from 'react';
import { Student } from '@/types/student';

interface PersonalDetailsFormProps {
    data: Student;
    onCampusChange: (campus: string) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ data, onCampusChange }) => {
    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Student Name
                </label>
                <input
                    type="text"
                    value={data.name}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
            </div>
            
            {/* Roll Number */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Roll Number
                </label>
                <input
                    type="text"
                    value={data.roll}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
            </div>
            
            {/* Campus (Editable) */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Campus <span className="text-blue-600 text-xs">(editable)</span>
                </label>
                <input
                    type="text"
                    value={data.campus}
                    onChange={(e) => onCampusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            {/* Program */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Program
                </label>
                <input
                    type="text"
                    value={data.program}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
            </div>
            
            {/* Examination Type */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Examination Type
                </label>
                <input
                    type="text"
                    value={data.type}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
            </div>
            
            {/* Admission Year */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                    Admission Year
                </label>
                <input
                    type="text"
                    value={data.admission_year}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                />
            </div>
        </div>
    );
};

export default PersonalDetailsForm;
