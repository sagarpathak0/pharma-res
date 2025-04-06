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