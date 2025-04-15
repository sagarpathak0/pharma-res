'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dseu from "@/public/dseulogo.png";
import First from "../components/first";
import Second from "../components/second";
import { generatePDF } from "@/utils/generatePdf";

export interface Subject {
  course_code: string;
  course_name: string;
  marks_obtained: string;
  month_year: string;
}

export interface Result {
  year: number;
  marks: Subject[];
}

export interface Student {
  name: string;
  roll: number;
  campus: string;
  program: string;
  type: string;
  admission_year: string;
  result: Result[];
}

interface SearchParams {
  rollNumber: string;
  academicYear: string;
  examType: "Regular" | "Reappear";
}

interface SearchResult {
  isLoading: boolean;
  error: string | null;
  data: Student | null;
}

interface AcademicYears {
  isLoading: boolean;
  years: string[];
  error: string | null;
}

export default function StudentResult() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    rollNumber: "",
    academicYear: "",
    examType: "Regular",
  });

  const [searchResult, setSearchResult] = useState<SearchResult>({
    isLoading: false,
    error: null,
    data: null,
  });

  const [academicYears, setAcademicYears] = useState<AcademicYears>({
    isLoading: false,
    years: [],
    error: null,
  });

  // Create ref to capture the result section
  const resultRef = useRef<HTMLDivElement>(null);

  // Fetch available academic years when roll number changes
  useEffect(() => {
    const fetchAcademicYears = async () => {
      if (searchParams.rollNumber.length >= 8) {
        // Assuming minimum roll number length
        setAcademicYears((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/academic-years/${searchParams.rollNumber}`
          );
          const data = await response.json();

          if (!response.ok) throw new Error(data.message);

          setAcademicYears({
            isLoading: false,
            years: data.years,
            error: null,
          });
        } catch (error) {
          setAcademicYears({
            isLoading: false,
            years: [],
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch academic years",
          });
        }
      } else {
        setAcademicYears({
          isLoading: false,
          years: [],
          error: null,
        });
      }
    };

    fetchAcademicYears();
  }, [searchParams.rollNumber]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchResult({ isLoading: true, error: null, data: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/results/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchParams),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setSearchResult({
        isLoading: false,
        error: null,
        data: result.data,
      });
    } catch (error) {
      setSearchResult({
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
        data: null,
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 text-black">
      {/* Header with Brand Colors */}
      <div className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-white p-1.5 sm:p-3 rounded-full">
                <Image
                  src={dseu}
                  alt="DSEU Logo"
                  width={40}
                  height={40}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </div>
              <h1 className="text-base sm:text-xl font-bold truncate">
                Student Result Portal
              </h1>
            </div>

            <button className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors">
              Student Portal
            </button>
          </div>
        </div>
      </div>

      {/* Search Form Panel */}
      <div className="w-full bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <form onSubmit={handleSearch} className="grid gap-3 sm:gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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
                    value={searchParams.rollNumber}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        rollNumber: e.target.value,
                        academicYear: "", // Reset academic year when roll number changes
                      }))
                    }
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter roll number"
                    required
                    disabled={searchResult.isLoading}
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
                    value={searchParams.academicYear}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        academicYear: e.target.value,
                      }))
                    }
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={academicYears.isLoading || academicYears.years.length === 0 || searchResult.isLoading}
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {academicYears.isLoading && (
                    <div className="mt-1 text-xs text-gray-500 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading years...
                    </div>
                  )}
                </div>
              </div>

              {/* Exam Type Selection */}
              <div className="space-y-1 flex flex-col">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Examination Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <select
                    id="examType"
                    value={searchParams.examType}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        examType: e.target.value as "Regular" | "Reappear",
                      }))
                    }
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={searchResult.isLoading}
                  >
                    <option value="Regular">Regular</option>
                    <option value="Reappear">Reappear</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex justify-center mt-1 sm:mt-2">
              <button
                type="submit"
                disabled={searchResult.isLoading || !searchParams.academicYear}
                className="w-fit h-fit px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 sm:gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {searchResult.isLoading ? (
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
                    <span>View Result</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content Area - Results Display */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
        {/* Error Display */}
        {searchResult.error && (
          <div className="text-center bg-white rounded-lg shadow-sm p-5 sm:p-8 max-w-3xl mx-auto border border-gray-200">
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
            <p className="mt-2 sm:mt-3 text-sm sm:text-2xl text-gray-500">
              {searchResult.error}
            </p>
          </div>
        )}

        {/* Result Display */}
        {searchResult.data && (
          <div className="max-w-4xl mx-auto">
            <div
              ref={resultRef}
              id="result-container"
              className="bg-white shadow-sm rounded-lg border border-gray-200 print:shadow-none print:border-none"
              style={{ backgroundColor: "#ffffff" }}
            >
              {searchResult.data.result[0]?.year === 1 && (
                <First student={searchResult.data} />
              )}
              {searchResult.data.result[0]?.year === 2 && (
                <Second student={searchResult.data} />
              )}
            </div>
            
            {/* Download Button */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => generatePDF(resultRef as React.RefObject<HTMLElement>)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        )}
        
        {/* Empty State - No Search Yet */}
        {!searchResult.data && !searchResult.error && !searchResult.isLoading && (
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
              Ready to View Results
            </h2>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500">
              Enter your roll number, select the academic year, and exam type to view your results.
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {searchResult.isLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
