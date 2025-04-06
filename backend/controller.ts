import { Request, Response } from 'express';
import { processAndInsertResults } from './models';
import { validateStudentData } from './utils/validation';

export async function processResults(req: Request, res: Response) {
  console.log('Processing results...');
  try {
    const data = req.body;
    console.log('Received data:', data);

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