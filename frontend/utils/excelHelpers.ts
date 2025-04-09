import { Student } from './interface';
import * as XLSX from 'xlsx';
// import axios from 'axios';

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

export const uploadToBackend = async (data: any[]): Promise<{
  success: boolean;
  message: string;
  duplicates?: Array<{
    roll: string;
    subject: string;
    exam_id: string;
  }>;
}> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    if (error && typeof error === 'object' && 'duplicates' in error) {
      return error as {
        success: false;
        message: string;
        duplicates: Array<{
          roll: string;
          subject: string;
          exam_id: string;
        }>;
      };
    }
    throw new Error('Failed to upload data');
  }
};

// Helper function to process Excel data
function processExcelData(data: any[][]): Student[] {
    // Extract global information from first two rows
    const global_keys = data[0].map((x: any) => (x ? String(x).trim() : ""));
    const global_values = data[1].map((x: any) => (x ? String(x).trim() : ""));
    const global_info: Record<string, string> = {};
    for (let i = 0; i < global_keys.length; i++) {
        if (i < global_values.length && global_keys[i] && global_values[i]) {
            global_info[global_keys[i]] = global_values[i];
        }
    }
    console.log(`Extracted global info:`, global_info);

    // Find header row (contains "Roll No", "Name", etc.) - now after the global info rows
    let headerRow = -1;
    for (let i = 2; i < data.length; i++) {
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
    const typeIdx = headers.findIndex(h => h.includes('type')); // Add index for type column
    
    // Extract global fields with defaults
    const campus = global_info["Campus"] || "";
    const program = global_info["Programme"] || "";
    const examMonthYear = global_info["Month and Year of Exam"] || "Month and Year of Exam";
    const defaultExamType = global_info["Type"] || "Regular"; // Use as fallback
    const admissionYear = global_info["Admission Year"] || "";
    let studentYear = 1;
    
    try {
        const match = (global_info["Year"] || "1").match(/(\d+)/);
        if (match) studentYear = parseInt(match[1]);
    } catch {
        studentYear = 1;
    }
    
    // Subject info rows are relative to the header row
    const subjectCodeRow = headerRow - 1;
    const subjectNameRow = headerRow;
    const subjectStartCol = Math.max(rollIdx, nameIdx, typeIdx) + 1; // Update to include typeIdx
    
    // Extract subject details
    const subjects: { code: string; name: string; column: number }[] = [];
    const maxCols = Math.max(...data.map(row => row.length));
    
    for (let col = subjectStartCol; col < maxCols; col++) {
        const code = data[subjectCodeRow]?.[col]?.toString().trim() || "";
        const name = data[subjectNameRow]?.[col]?.toString().trim() || "";
        
        if (code || name) {
            subjects.push({
                code: code || `SUBJ-${col}`,
                name: name || `Subject ${col}`,
                column: col
            });
        }
    }
    
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
        
        // Extract type from row or use default
        const examType = typeIdx >= 0 && row[typeIdx] 
            ? String(row[typeIdx]).trim() 
            : defaultExamType;
        
        // Create student object with global info
        const student: Student = {
            name,
            roll,
            campus,
            program,
            type: examType, // Now using the value from the row
            admission_year: admissionYear,
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
                
                // Skip invalid marks
                if (['ab', 'absent', 'na', 'none', '-'].includes(marksStr.toLowerCase())) {
                    continue;
                }
                
                const subjectEntry = {
                    course_code: subject.code,
                    course_name: subject.name,
                    marks_obtained: marksStr,
                    month_year: examMonthYear
                };
                
                student.result[0].marks.push(subjectEntry);
            }
        }
        
        // Only add students with at least one subject with marks
        if (student.result[0].marks.length > 0) {
            students.push(student);
        }
    }
    
    return students;
}

