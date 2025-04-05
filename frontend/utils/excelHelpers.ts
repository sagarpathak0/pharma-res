import { Student } from './interface';
import * as XLSX from 'xlsx';
import axios from 'axios';


export const convertExcelToJson = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Use the original excelToJson logic but adapted for browser
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // Fix the type issue by providing the correct type
        const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 }) as any[][];
        
        // Process the data similar to the original excelToJson function
        const students: Student[] = processExcelData(jsonData);
        
        resolve(students);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const uploadToBackend = async (data: Student[]): Promise<void> => {
  try {
    // Dummy API endpoint - replace with your actual endpoint
    // const response = await axios.post('http://localhost:3001/api/results/upload', {
    //   data,
    //   timestamp: new Date().toISOString(),
    //   uploadedBy: 'admin'
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // Add any auth headers if needed
    //     // 'Authorization': `Bearer ${token}`
    //   }
    // });



    // if (!response.data.success) {
    //   throw new Error(response.data.message || 'Upload failed');
    // }

    // return response.data;

    console.log(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Network error occurred');
    }
    throw new Error('Failed to upload data to server');
  }
};

// Helper function to process Excel data
function processExcelData(data: any[][]): Student[] {
    // Find header row (contains "Roll No", "Name", etc.)
    let headerRow = -1;
    for (let i = 0; i < data.length; i++) {
        const row = data[i] || [];
        const rowText = row.map(x => String(x).toLowerCase()).join(' ');
        if (rowText.includes('roll') && rowText.includes('name')) {
            headerRow = i;
            break;
        }
    }
    
    if (headerRow === -1) {
        throw new Error("Could not find header row with Roll and Name columns");
    }
    
    // Extract column indices from header row
    const headers = (data[headerRow] || []).map(h => 
        h ? String(h).toLowerCase().trim() : '');
    
    // Find essential column indices
    const rollIdx = headers.findIndex(h => h.includes('roll'));
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const campusIdx = headers.findIndex(h => h.includes('campus'));
    const programIdx = headers.findIndex(h => h.includes('program') || h.includes('programme'));
    const yearIdx = headers.findIndex(h => h.includes('year') && !h.includes('month'));
    const monthYearIdx = headers.findIndex(h => h.includes('month') && h.includes('year'));
    
    // Default month_year value
    const defaultMonthYear = "Month and Year of Exam";
    
    // Subject info rows and starting column
    const subjectCodeRow = 0; // Row 1 has subject codes
    const subjectNameRow = 1; // Row 2 has subject names
    const subjectStartCol = 8; // Subjects start from column 9 (index 8)
    
    // Extract subject details
    const subjects: { code: string; name: string; column: number }[] = [];
    for (let col = subjectStartCol; col < (data[0]?.length || 0); col++) {
        const code = data[subjectCodeRow]?.[col] ? String(data[subjectCodeRow][col]).trim() : '';
        const name = data[subjectNameRow]?.[col] ? String(data[subjectNameRow][col]).trim() : '';
        
        // Only add if we have a code or name
        if (code || name) {
            subjects.push({
                code: code || `SUBJ-${col}`,
                name: name || `Subject ${col}`,
                column: col
            });
        }
    }
    
    // Extract year from file name or header rows - we'll use default here
    const defaultYear = 1;
    const academicYear = defaultYear;
    
    // Process students
    const students: Student[] = [];
    
    for (let i = headerRow + 1; i < data.length; i++) {
        const row = data[i] || [];
        
        // Skip if roll number is missing
        if (!row[rollIdx]) {
            continue;
        }
        
        // Extract roll number
        const rollStr = String(row[rollIdx]);
        let roll: number;
        try {
            roll = parseInt(rollStr.replace(/\D/g, ''));
            if (roll === 0) {
                continue;
            }
        } catch {
            continue;
        }
        
        // Extract name
        const name = row[nameIdx] ? String(row[nameIdx]).trim() : '';
        
        // Extract campus and program
        const campus = campusIdx >= 0 && campusIdx < row.length && row[campusIdx] ? 
            String(row[campusIdx]).trim() : '';
        const program = programIdx >= 0 && programIdx < row.length && row[programIdx] ? 
            String(row[programIdx]).trim() : '';
        
        // Extract month and year if column was found
        let studentMonthYear = defaultMonthYear;
        if (monthYearIdx >= 0 && monthYearIdx < row.length && row[monthYearIdx]) {
            studentMonthYear = String(row[monthYearIdx]).trim();
        }
        
        // Extract student-specific year if available
        let studentYear = academicYear;
        if (yearIdx >= 0 && yearIdx < row.length && row[yearIdx]) {
            const yearText = String(row[yearIdx]);
            const match = yearText.match(/(\d+)/);
            if (match) {
                studentYear = parseInt(match[1], 10);
            }
        }
        
        // Create student object
        const student: Student = {
            name,
            roll,
            campus,
            program,
            result: [
                {
                    year: studentYear,
                    marks: []
                }
            ]
        };
        
        // Extract marks for each subject
        for (const subject of subjects) {
            const colIdx = subject.column;
            
            if (colIdx < row.length && row[colIdx] !== null && row[colIdx] !== undefined) {
                const marksValue = row[colIdx];
                let marksStr: string;
                
                // Format marks
                if (typeof marksValue === 'number') {
                    marksStr = Number.isInteger(marksValue) ? 
                        String(marksValue) : String(marksValue);
                } else {
                    marksStr = String(marksValue).trim();
                }
                

                
                const subjectEntry = {
                    course_code: subject.code,
                    course_name: subject.name,
                    marks_obtained: marksStr,
                    month_year: studentMonthYear
                };
                
                student?.result[0]?.marks?.push(subjectEntry);
            }
        }
        
        // Only add students with at least one subject with marks
        if ((student?.result[0]?.marks?.length ?? 0) > 0) {
            students.push(student);
        }
    }
    
    return students;
}

