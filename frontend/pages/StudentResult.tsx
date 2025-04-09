import React, { useState } from 'react';
import Image from 'next/image';

interface SearchParams {
  rollNumber: string;
  academicYear: string;
  examType: 'Regular' | 'Reappear';
}

interface SearchResult {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

export default function StudentResult() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    rollNumber: '',
    academicYear: '',
    examType: 'Regular'
  });

  const [searchResult, setSearchResult] = useState<SearchResult>({
    isLoading: false,
    error: null,
    data: null
  });

  const academicYears = [
    '2023-2024',
    '2022-2023',
    '2021-2022'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult({ isLoading: true, error: null, data: null });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid content type');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch result');
      }

      setSearchResult({
        isLoading: false,
        error: null,
        data: data.data // Access the data property from the response
      });

    } catch (error) {
      setSearchResult({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Image 
            src="/dseulogo.png" 
            alt="DSEU Logo" 
            width={100} 
            height={100} 
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Student Result Portal
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your details to view your result
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              required
              value={searchParams.rollNumber}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                rollNumber: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your roll number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <select
              required
              value={searchParams.academicYear}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                academicYear: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Type
            </label>
            <select
              required
              value={searchParams.examType}
              onChange={(e) => setSearchParams(prev => ({
                ...prev,
                examType: e.target.value as 'Regular' | 'Reappear'
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Regular">Regular</option>
              <option value="Reappear">Reappear</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={searchResult.isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${searchResult.isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {searchResult.isLoading ? 'Searching...' : 'Search Result'}
          </button>
        </form>

        {/* Error Message */}
        {searchResult.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{searchResult.error}</p>
          </div>
        )}

        {/* Result Display */}
        {searchResult.data && (
          <div className="mt-6 bg-white shadow rounded-lg">
            {/* Import and use your existing result display component */}
            <div className="p-6">
              {/* Add your result display component here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}