import React from 'react';

interface SearchFormProps {
  rollNumber: string;
  setRollNumber: (value: string) => void;
  academicYear: string;
  setAcademicYear: (value: string) => void;
  examType: string;
  setExamType: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  academicYears: {
    isLoading: boolean;
    years: string[];
    error: string | null;
  };
}

const SearchForm: React.FC<SearchFormProps> = ({
  rollNumber,
  setRollNumber,
  academicYear,
  setAcademicYear,
  examType,
  setExamType,
  isLoading,
  onSubmit,
  academicYears,
}) => {
  return (
    <div className="w-full bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Roll Number Input */}
            <div className="space-y-1">
              <label
                htmlFor="rollNumber"
                className="block text-xs sm:text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter roll number"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Academic Year Dropdown */}
            <div className="space-y-1">
              <label
                htmlFor="academicYear"
                className="block text-xs sm:text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <select
                  id="academicYear"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm 
                    focus:ring-blue-500 focus:border-blue-500
                    ${(isLoading || academicYears.isLoading || academicYears.years.length === 0) 
                      ? 'bg-gray-50 cursor-not-allowed' 
                      : ''}`
                  }
                  required
                  disabled={isLoading || academicYears.isLoading || academicYears.years.length === 0}
                >
                  <option value="">
                    {academicYears.isLoading 
                      ? 'Loading...' 
                      : academicYears.years.length === 0 
                        ? 'Enter roll number first' 
                        : 'Select Academic Year'
                    }
                  </option>
                  {academicYears.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {academicYears.isLoading && (
                  <p className="mt-1 text-xs text-gray-500">Loading academic years...</p>
                )}
                {academicYears.error && (
                  <p className="mt-1 text-xs text-red-500">{academicYears.error}</p>
                )}
              </div>
            </div>

            {/* Exam Type Selection */}
            <div className="space-y-1 flex flex-col">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Examination Type
              </label>
              <div className="flex items-center mt-1 h-9 sm:h-10">
                <div className="flex gap-4 sm:gap-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="regular"
                      checked={examType === "regular"}
                      onChange={(e) => setExamType(e.target.value)}
                      className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">
                      Regular
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="reappear"
                      checked={examType === "reappear"}
                      onChange={(e) => setExamType(e.target.value)}
                      className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">
                      Reappear
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-1 sm:mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit h-fit px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 sm:gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search Result</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
