'use client';
import React, { useState, useEffect, useRef } from "react";
import First from "../components/first";
import Second from "../components/second";
// import { useReactToPrint } from 'react-to-print';
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

  // Fix how useReactToPrint is configured
  // const handlePrint = useReactToPrint({
  //   contentRef: resultRef,
  //   documentTitle: 'Student Result',
  //   onBeforePrint: () => {
  //     console.log("Ref exists before print:", !!resultRef.current);
  //     return Promise.resolve();
  //   },
  //   onAfterPrint: () => console.log('Printed successfully'),
  //   pageStyle: `
  //     @page {
  //       margin: 10mm;
  //     }
  //     @media print {
  //       body {
  //         -webkit-print-color-adjust: exact;
  //         print-color-adjust: exact;
  //         background-color: #ffffff !important;
  //       }
  //       * {
  //         background-color: white !important;
  //       }
  //     }
  //   `,
  // });

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Result Portal
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your details to view your results
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Roll Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                required
                value={searchParams.rollNumber}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    rollNumber: e.target.value,
                    academicYear: "", // Reset academic year when roll number changes
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your roll number"
              />
            </div>

            {/* Academic Year Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                required
                value={searchParams.academicYear}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    academicYear: e.target.value,
                  }))
                }
                disabled={
                  academicYears.isLoading || academicYears.years.length === 0
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select Academic Year</option>
                {academicYears.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {academicYears.isLoading && (
                <p className="mt-1 text-sm text-gray-500">
                  Loading academic years...
                </p>
              )}
            </div>

            {/* Exam Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type
              </label>
              <select
                required
                value={searchParams.examType}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    examType: e.target.value as "Regular" | "Reappear",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Regular">Regular</option>
                <option value="Reappear">Reappear</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={searchResult.isLoading || !searchParams.academicYear}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {searchResult.isLoading ? "Searching..." : "View Result"}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {searchResult.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{searchResult.error}</p>
          </div>
        )}

        {/* Result Display */}
        {searchResult.data && (
          <div className="mt-6">
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
            {/* Print Button */}
            <button
              type="button"
              onClick={() => generatePDF(resultRef as React.RefObject<HTMLElement>)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                         rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
