import { processAndInsertResults, StudentResult } from './models';

export async function insertResults(data: StudentResult[]) {
  try {
    return await processAndInsertResults(data);
  } catch (error) {
    console.error('Error in insertResults:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}