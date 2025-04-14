import React, { useState, useEffect } from "react";
import Image from "next/image";
import dseu from "@/public/dseulogo.png";
import StudentDataDisplay from "@/components/admin/StudentDataDisplay";
import axios from "axios";

// Define interfaces for the API response types
interface Subject {
  course_code: string;
  course_name: string;
  marks_obtained: string;
  month_year: string;
}

interface Result {
  year: number;
  marks: Subject[];
}

interface Student {
  name: string;
  roll: number;
  campus: string;
  program: string;
  type: string;
  admission_year: string;
  result: Result[];
}

interface SearchResult {
  isLoading: boolean;
  error: string | null;
  data: Student | null;
}

function App() {
    const [rollNumber, setRollNumber] = useState("");
    const [academicYear, setAcademicYear] = useState("2023-24");
    const [examType, setExamType] = useState("regular");
    const [showResult, setShowResult] = useState(false);
    
    // Add state for search results
    const [searchResult, setSearchResult] = useState<SearchResult>({
        isLoading: false,
        error: null,
        data: null
    });

    // Add state for data saving
    const [isSaving, setIsSaving] = useState(false);

    // Function to handle the API call
    const fetchStudentData = async () => {
        console.log("Fetching data with params:", {
            rollNumber,
            academicYear,
            examType
        });
        
        setSearchResult({
            isLoading: true,
            error: null,
            data: null
        });
        
        try {
            // Format the examType to match API expectations (capitalize first letter)
            const formattedExamType = examType.charAt(0).toUpperCase() + examType.slice(1);
            
            // Create the request body
            const requestBody = {
                rollNumber: rollNumber,
                academicYear: academicYear,
                examType: formattedExamType
            };
            
            // Make the API call
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/results/search`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );
            
            const result = await response.json();
            
            if (!result.data) {
                // Handle case where API returns success but no data
                setSearchResult({
                    isLoading: false,
                    error: "No student data found with the provided details",
                    data: null
                });
            } else {
                // Set the result data
                setSearchResult({
                    isLoading: false,
                    error: null,
                    data: result.data
                });
                
                // Log the data to console
                console.log("Student data retrieved:", result.data);
            }
            
            // Show the result UI
            setShowResult(true);
            
        } catch (error) {
            console.error("Error fetching student data:", error);
            
            setSearchResult({
                isLoading: false,
                error: error instanceof Error ? error.message : "An unknown error occurred",
                data: null
            });
            
            // Show the "no result" UI
            setShowResult(true);
        }
    };

    // update campus api call: `${process.env.NEXT_PUBLIC_API_URL}/api/students/{roll_number}/${campus}`

    // update appear marks api call: `${process.env.NEXT_PUBLIC_API_URL}/api/results/reappear`

    // update regular api call: `${process.env.NEXT_PUBLIC_API_URL}/api/results/regular`

    // {
    //     "rollNumber": "123456",
    //     "subjects": [
    //       {
    //         "course_code": "ER20-HF102",
    //         "marks_obtained": "45"
    //       },
    //       {
    //         "course_code": "ER20-HF102",
    //         "marks_obtained": "45"
    //       },
    //     ],
    //     "examMonth": "June", // slice year (month_year="June, 2023")
    //     "examYear": "2023", // slice month (month_year="June, 2023')
    // }

    // check on marks obtained: should be number between 0-100 or string as "A", "UFM"

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

    // Function to update campus
    const handleCampusUpdate = async (student: Student, newCampus: string) => {
        setIsSaving(true);
        console.log("Updating campus for student:", student.roll, "New campus:", newCampus);
        
        try {
            // Make API call to update campus
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/students/${student.roll}/${encodeURIComponent(newCampus)}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            if (response.data.success) {
                // Update local state with new campus
                setSearchResult(prev => ({
                    ...prev,
                    data: {
                        ...prev.data!,
                        campus: newCampus
                    }
                }));
                
                console.log("Campus updated successfully");
                alert("Campus updated successfully");
            } else {
                throw new Error(response.data.message || "Failed to update campus");
            }
            
        } catch (error) {
            console.error("Error updating campus:", error);
            
            let errorMessage = "Error updating campus.";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = `Server error: ${error.response.data.message || error.response.status}`;
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your connection.";
                } else {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Function to update regular marks
    const handleRegularMarksUpdate = async (student: Student, updatedSubjects: Subject[], changedMarksOnly: Subject[]) => {
        setIsSaving(true);
        console.log("Updating regular marks for student:", student.roll);
        
        try {
            // Validate all changed marks
            for (const subject of changedMarksOnly) {
                const validation = validateMarks(subject.marks_obtained);
                if (!validation.isValid) {
                    throw new Error(`Invalid marks for ${subject.course_name}: ${validation.message}`);
                }
            }
            
            // Check if we have any subjects to update
            if (changedMarksOnly.length === 0) {
                alert("No changes detected. Nothing to update.");
                setIsSaving(false);
                return;
            }
            
            // Extract month and year from month_year string (e.g., "June, 2023")
            const monthYearStr = updatedSubjects[0].month_year;
            const monthYearParts = monthYearStr.split(", ");
            if (monthYearParts.length !== 2) {
                throw new Error("Invalid month_year format. Expected 'Month, Year'");
            }
            
            const examMonth = monthYearParts[0]; // e.g., "June"
            const examYear = monthYearParts[1];  // e.g., "2023"
            
            // Prepare payload with only changed marks
            const payload = {
                rollNumber: student.roll.toString(),
                subjects: changedMarksOnly.map(subject => ({
                    course_code: subject.course_code,
                    marks_obtained: subject.marks_obtained
                })),
                examMonth,
                examYear
            };
            
            console.log("Sending regular marks payload (only changed marks):", payload);
            
            // Make API call to update regular marks
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/results/regular`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            if (response.data.success) {
                console.log("Regular marks updated successfully");
                alert("Regular marks updated successfully");
                
                // Refresh data to ensure we have the latest state
                fetchStudentData();
            } else {
                throw new Error(response.data.message || "Failed to update regular marks");
            }
            
        } catch (error) {
            console.error("Error updating regular marks:", error);
            
            let errorMessage = "Error updating marks.";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = `Server error: ${error.response.data.message || error.response.status}`;
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your connection.";
                } else {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };
    
    // Function to update reappear marks
    const handleReappearMarksUpdate = async (student: Student, updatedSubjects: Subject[], changedMarksOnly: Subject[]) => {
        setIsSaving(true);
        console.log("Updating reappear marks for student:", student.roll);
        
        try {
            // Validate all changed marks
            for (const subject of changedMarksOnly) {
                const validation = validateMarks(subject.marks_obtained);
                if (!validation.isValid) {
                    throw new Error(`Invalid marks for ${subject.course_name}: ${validation.message}`);
                }
            }
            
            // Check if we have any subjects to update
            if (changedMarksOnly.length === 0) {
                alert("No changes detected. Nothing to update.");
                setIsSaving(false);
                return;
            }
            
            // Extract month and year from month_year string (e.g., "June, 2023")
            const monthYearStr = updatedSubjects[0].month_year;
            const monthYearParts = monthYearStr.split(", ");
            if (monthYearParts.length !== 2) {
                throw new Error("Invalid month_year format. Expected 'Month, Year'");
            }
            
            const examMonth = monthYearParts[0]; // e.g., "June"
            const examYear = monthYearParts[1];  // e.g., "2023"
            
            // Prepare payload with only changed marks
            const payload = {
                rollNumber: student.roll.toString(),
                subjects: changedMarksOnly.map(subject => ({
                    course_code: subject.course_code,
                    marks_obtained: subject.marks_obtained
                })),
                examMonth,
                examYear
            };
            
            console.log("Sending reappear marks payload (only changed marks):", payload);
            
            // Make API call to update reappear marks
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/results/reappear`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            if (response.data.success) {
                console.log("Reappear marks updated successfully");
                alert("Reappear marks updated successfully");
                
                // Refresh data to ensure we have the latest state
                fetchStudentData();
            } else {
                throw new Error(response.data.message || "Failed to update reappear marks");
            }
            
        } catch (error) {
            console.error("Error updating reappear marks:", error);
            
            let errorMessage = "Error updating marks.";
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = `Server error: ${error.response.data.message || error.response.status}`;
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your connection.";
                } else {
                    errorMessage = error.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Handler for overall data saving - will call the appropriate update function based on exam type
    const handleSaveData = async (updatedData: Student, updatedField: 'campus' | 'marks', changedSubjects?: Subject[]) => {
        if (updatedField === 'campus') {
            await handleCampusUpdate(updatedData, updatedData.campus);
        } else if (updatedField === 'marks') {
            // Get all subjects from all years for context
            const allSubjects = updatedData.result.flatMap(year => year.marks);
            
            // Ensure we have the changed subjects
            if (!changedSubjects || changedSubjects.length === 0) {
                alert("No changes detected. Nothing to update.");
                return;
            }
            
            // Call appropriate function based on exam type
            if (updatedData.type.toLowerCase() === 'regular') {
                await handleRegularMarksUpdate(updatedData, allSubjects, changedSubjects);
            } else if (updatedData.type.toLowerCase() === 'reappear') {
                await handleReappearMarksUpdate(updatedData, allSubjects, changedSubjects);
            } else {
                alert(`Unknown exam type: ${updatedData.type}`);
            }
        }
    };

    // Modify the submit handler to call the fetch function
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStudentData();
    };

    // Add effect to log any state changes for debugging
    useEffect(() => {
        if (searchResult.data) {
            console.log("Search result updated:", searchResult.data);
        }
        if (searchResult.error) {
            console.error("Search error:", searchResult.error);
        }
    }, [searchResult]);

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
                                        <option value="2023-2024">2023-24</option>
                                        <option value="2022-2023">2022-23</option>
                                        <option value="2021-2022">2021-22</option>
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

            {/* Main Content - Display Student Data or "Ready to Search" */}
            <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
                {searchResult.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : searchResult.data ? (
                    <StudentDataDisplay 
                        studentData={searchResult.data} 
                        onSave={handleSaveData}
                        isSaving={isSaving}
                    />
                ) : showResult ? (
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
                            {searchResult.error || "We couldn't find any student matching your search criteria."}
                        </p>
                        <div className="mt-4 sm:mt-6">
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                Search details:
                            </p>
                            <ul className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 list-none text-left space-y-1">
                                <li><span className="font-medium">Roll Number:</span> {rollNumber}</li>
                                <li><span className="font-medium">Academic Year:</span> {academicYear}</li>
                                <li><span className="font-medium">Exam Type:</span> {examType.charAt(0).toUpperCase() + examType.slice(1)}</li>
                            </ul>
                            
                            <div className="mt-4 sm:mt-5 pt-3 border-t border-gray-100">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Try adjusting your search parameters:
                                </p>
                                <ul className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600 list-disc list-inside text-left">
                                    <li>Check the roll number for typos</li>
                                    <li>Try a different academic year</li>
                                    <li>
                                        Switch between Regular and Reappear exam types
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center max-w-md mx-auto bg-white p-5 sm:p-8 rounded-lg shadow-sm border border-gray-200">
                        {/* Ready to Search Content */}
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
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
