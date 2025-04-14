import React from 'react';

interface NotFoundStateProps {
  error: string | null;
  searchParams: {
    rollNumber: string;
    academicYear: string;
    examType: string;
  };
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ error, searchParams }) => {
  return (
    <div className="text-center bg-white rounded-lg shadow-sm p-5 sm:p-8 max-w-md mx-auto border border-gray-200">
      <div className="bg-red-50 rounded-full mx-auto h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center">
        <svg
          className="h-12 sm:h-16 w-12 sm:w-16 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-medium text-gray-900">
        Student Not Found
      </h2>
      <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500">
        {error || "We couldn't find any student matching your search criteria."}
      </p>
      <div className="mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Search details:
        </p>
        <ul className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 list-none text-left space-y-1">
          <li><span className="font-medium">Roll Number:</span> {searchParams.rollNumber}</li>
          <li><span className="font-medium">Academic Year:</span> {searchParams.academicYear}</li>
          <li>
            <span className="font-medium">Exam Type:</span> 
            {searchParams.examType.charAt(0).toUpperCase() + searchParams.examType.slice(1)}
          </li>
        </ul>
        
        <div className="mt-4 sm:mt-5 pt-3 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Try adjusting your search parameters:
          </p>
          <ul className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 list-disc list-inside text-left">
            <li>Check the roll number for typos</li>
            <li>Try a different academic year</li>
            <li>Switch between Regular and Reappear exam types</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundState;
