import React, { useState, useEffect } from "react";
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

    const [academicYears, setAcademicYears] = useState<{
        isLoading: boolean;
        years: string[];
        error: string | null;
    }>({
        isLoading: false,
        years: [],
        error: null
    });

    const [searchState, setSearchState] = useState({
        isLoading: false,
        error: null as string | null,
        noResults: false
    });

    useEffect(() => {
        const fetchAcademicYears = async () => {
            if (rollNumber.length >= 8) {
                setAcademicYears(prev => ({ ...prev, isLoading: true, error: null }));
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/academic-years/${rollNumber}`
                    );
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.message);

                    setAcademicYears({
                        isLoading: false,
                        years: data.years,
                        error: null
                    });

                    // Set first year as default if available
                    if (data.years.length > 0) {
                        setAcademicYear(data.years[0]);
                    }
                } catch (error) {
                    setAcademicYears({
                        isLoading: false,
                        years: [],
                        error: error instanceof Error ? error.message : "Failed to fetch academic years"
                    });
                }
            } else {
                setAcademicYears({
                    isLoading: false,
                    years: [],
                    error: null
                });
            }
        };

        fetchAcademicYears();
    }, [rollNumber]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Add validation
        if (!rollNumber || !academicYear || !examType) {
            setSearchResult({
                isLoading: false,
                error: "Please fill in all required fields",
                data: null
            });
            setShowResult(true);
            return;
        }

        if (rollNumber.length < 8) {
            setSearchResult({
                isLoading: false,
                error: "Please enter a valid roll number",
                data: null
            });
            setShowResult(true);
            return;
        }

        setSearchState({ isLoading: true, error: null, noResults: false });
        setSearchResult({ isLoading: true, error: null, data: null });
        
        try {
            const params = {
                rollNumber,
                academicYear,
                examType: examType.charAt(0).toUpperCase() + examType.slice(1)
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/results/search`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.data) {
                setSearchState({
                    isLoading: false,
                    error: null,
                    noResults: true
                });
                setSearchResult({
                    isLoading: false,
                    error: "No results found for the given criteria",
                    data: null
                });
                setShowResult(true);
                return;
            }

            setSearchState({
                isLoading: false,
                error: null,
                noResults: false
            });
            
            setSearchResult({
                isLoading: false,
                error: null,
                data: result.data
            });
            setShowResult(true);
        
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "An unexpected error occurred";
            
            setSearchState({
                isLoading: false,
                error: errorMessage,
                noResults: false
            });
            
            setSearchResult({
                isLoading: false,
                error: errorMessage,
                data: null
            });
            setShowResult(true);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 text-black">
            <AdminHeader />

            <SearchForm
                rollNumber={rollNumber}
                setRollNumber={setRollNumber}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                examType={examType}
                setExamType={setExamType}
                isLoading={searchState.isLoading}
                onSubmit={handleSearch}
                academicYears={academicYears}
            />

            <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-auto">
                {searchResult.isLoading ? (
                    <LoadingState />
                ) : searchResult.data ? (
                    <StudentController 
                        studentData={searchResult.data} 
                        onRefresh={handleSearch}
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
