import React, { useState } from "react";
import { SearchResult } from "@/types/student";
import { searchStudentResults } from "@/utils/api";

import AdminHeader from "@/components/admin/AdminHeader";
import SearchForm from "@/components/admin/SearchForm";
import StudentController from "@/components/admin/StudentController";
import NotFoundState from "@/components/admin/NotFoundState";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";

function App() {
    const [rollNumber, setRollNumber] = useState("");
    const [academicYear, setAcademicYear] = useState("2022-23");
    const [examType, setExamType] = useState("regular");
    const [showResult, setShowResult] = useState(false);
    
    // Add state for search results
    const [searchResult, setSearchResult] = useState<SearchResult>({
        isLoading: false,
        error: null,
        data: null
    });

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
            const params = {
                rollNumber,
                academicYear,
                examType: formattedExamType
            };
            
            // Make the API call
            const result = await searchStudentResults(params);
            
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

    // Modify the submit handler to call the fetch function
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStudentData();
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 text-black">
            {/* Header Component */}
            <AdminHeader />

            {/* Search Form Component */}
            <SearchForm
                rollNumber={rollNumber}
                setRollNumber={setRollNumber}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                examType={examType}
                setExamType={setExamType}
                isLoading={searchResult.isLoading}
                onSubmit={handleSubmit}
            />

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
                {searchResult.isLoading ? (
                    <LoadingState />
                ) : searchResult.data ? (
                    <StudentController 
                        studentData={searchResult.data} 
                        onRefresh={fetchStudentData}
                    />
                ) : showResult ? (
                    <NotFoundState 
                        error={searchResult.error} 
                        searchParams={{ rollNumber, academicYear, examType }}
                    />
                ) : (
                    <EmptyState message="Enter a student's roll number, select the academic year, and exam type to view their results." />
                )}
            </div>
        </div>
    );
}

export default App;
