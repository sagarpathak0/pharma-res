import React from 'react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center max-w-md mx-auto bg-white p-5 sm:p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="bg-blue-50 rounded-full mx-auto h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 sm:h-12 w-10 sm:w-12 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h2 className="mt-4 sm:mt-5 text-lg sm:text-xl font-medium text-gray-900">
        Ready to Search Results
      </h2>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
