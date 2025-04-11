import React, { useState } from "react";
import Image from "next/image";
import dseu from "@/public/dseulogo.png";

function App() {
    const [rollNumber, setRollNumber] = useState("");
    const [academicYear, setAcademicYear] = useState("2023-24");
    const [examType, setExamType] = useState("regular");
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResult(true);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 text-black">
            {/* Enhanced Header with Brand Colors */}
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
                                Admin Student Result Portal
                            </h1>
                        </div>

                        <button className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors">
                            Admin Portal
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Search Panel */}
            <div className="w-full bg-white shadow-md border-b">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-3 sm:gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                                        onChange={(e) =>
                                            setRollNumber(e.target.value)
                                        }
                                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter roll number"
                                        required
                                    />
                                </div>
                            </div>

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
                                        onChange={(e) =>
                                            setAcademicYear(e.target.value)
                                        }
                                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                                        required>
                                        <option value="2023-24">2023-24</option>
                                        <option value="2022-23">2022-23</option>
                                        <option value="2021-22">2021-22</option>
                                    </select>
                                </div>
                            </div>

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
                                                onChange={(e) =>
                                                    setExamType(e.target.value)
                                                }
                                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">
                                                Regular
                                            </span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="reappear"
                                                checked={
                                                    examType === "reappear"
                                                }
                                                onChange={(e) =>
                                                    setExamType(e.target.value)
                                                }
                                                className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">
                                                Reappear
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {/* Search Button Row */}
                        </div>
                        <div className="flex justify-center mt-1 sm:mt-2">
                            <button
                                type="submit"
                                className="w-fit h-fit px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 sm:gap-2">
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
                                Search Result
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content - Enhanced No Result Found */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gray-50">
                {showResult ? (
                    <div className="text-center bg-white rounded-lg shadow-sm p-5 sm:p-8 max-w-md mx-auto border border-gray-200">
                        <div className="bg-gray-100 rounded-full mx-auto h-20 sm:h-24 w-20 sm:w-24 flex items-center justify-center">
                            <svg
                                className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-medium text-gray-900">
                            No Result Found
                        </h2>
                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500">
                            We couldn&apos;t find any results matching your
                            search criteria.
                        </p>
                        <div className="mt-4 sm:mt-6">
                            <p className="text-xs sm:text-sm text-gray-500">
                                Try adjusting your search parameters:
                            </p>
                            <ul className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 list-disc list-inside text-left">
                                <li>Check the roll number for typos</li>
                                <li>Try a different academic year</li>
                                <li>
                                    Switch between Regular and Reappear exam
                                    types
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
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
                            Enter a student&apos;s roll number, select the
                            academic year, and exam type to view their results.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
