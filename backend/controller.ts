import { Request, Response } from 'express';
import { processAndInsertResults } from './models';
import { validateStudentData } from './utils/validation';
import { 
  searchResultsByRollNo, 
  fetchAcademicYearsByRollNo,
  updateCampus,
  updateMarks 
} from './service';

export async function processResults(req: Request, res: Response) {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected non-empty array'
      });
    }

    // Validate data
    for (const student of data) {
      const validationError = validateStudentData(student);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }
    }

    // Process and insert data
    const result = await processAndInsertResults(data);

    if (!result.success) {
      // If duplicates found, return them in the response
      if (result.duplicates) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate entries found',
          duplicates: result.duplicates
        });
      }
      return res.status(400).json(result);
    }

    res.status(200).json({
      success: true,
      message: 'Data processed and inserted successfully'
    });

  } catch (error) {
    console.error('Error processing results:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

export async function searchResults(req: Request, res: Response) {
  try {
    const { rollNumber, academicYear, examType } = req.body;
    
    console.log('Search Parameters:', { rollNumber, academicYear, examType });

    // Validate input
    if (!rollNumber || !academicYear || !examType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await searchResultsByRollNo(rollNumber, academicYear, examType);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No results found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in searchResults:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export async function getAcademicYears(req: Request, res: Response) {
  try {
    const { rollNo } = req.params;
    const years = await fetchAcademicYearsByRollNo(rollNo);
    
    res.status(200).json({
      success: true,
      years
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch academic years'
    });
  }
}

export async function updateStudentCampus(req: Request, res: Response) {
  try {
    const { rollNo } = req.params;
    const { campus } = req.params;
    
    if (!rollNo || !campus) {
      return res.status(400).json({
        success: false,
        message: 'Missing roll number or campus'
      });
    }
    
    const result = await updateCampus(rollNo, campus);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Campus updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export async function updateReappearMarks(req: Request, res: Response) {
  try {
    const { rollNumber, subjects, examMonth, examYear } = req.body;
    
    if (!rollNumber || !subjects || !examMonth || !examYear) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const result = await updateMarks(
      rollNumber, subjects, examMonth, examYear, 'Reappear'
    );
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reappear marks updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating reappear marks:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

export async function updateRegularMarks(req: Request, res: Response) {
  try {
    const { rollNumber, subjects, examMonth, examYear } = req.body;
    
    if (!rollNumber || !subjects || !examMonth || !examYear) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const result = await updateMarks(
      rollNumber, subjects, examMonth, examYear, 'Regular'
    );
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Regular marks updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating regular marks:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}