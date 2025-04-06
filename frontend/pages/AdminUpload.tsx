import React, { useState } from 'react';
import { convertExcelToJson, uploadToBackend } from '../utils/excelHelpers';
import { FiUpload, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface UploadState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fileName: string | null;
  progress: number;
  processedData: any[] | null;  // Add this to store processed data
  isProcessed: boolean;         // Add this to track if data is processed but not saved
  isSaving: boolean;           // Add this to track database saving state
}

const AdminUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isLoading: false,
    error: null,
    success: false,
    fileName: null,
    progress: 0,
    processedData: null,
    isProcessed: false,
    isSaving: false
  });
  
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    processFile(file);
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    setUploadState({
      ...uploadState,
      isLoading: true,
      error: null,
      success: false,
      fileName: file.name,
      progress: 10,
      processedData: null,
      isProcessed: false
    });

    try { 
      setUploadState(prev => ({ ...prev, progress: 30 }));
      
      // Convert Excel to JSON
      const jsonData = await convertExcelToJson(file);
      
      setUploadState(prev => ({
        ...prev,
        progress: 100,
        isLoading: false,
        processedData: jsonData,
        isProcessed: true
      }));
    } catch (error) {
      setUploadState({
        ...uploadState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false,
        fileName: file.name,
        progress: 0,
        processedData: null,
        isProcessed: false
      });
    }
  };

  const handleSaveToDatabase = async () => {
    if (!uploadState.processedData) return;
  
    setUploadState(prev => ({ ...prev, isSaving: true }));
    
    try {
      await uploadToBackend(uploadState.processedData);
      
      setUploadState(prev => ({
        ...prev,
        isSaving: false,
        success: true,
        isProcessed: false,
        processedData: null
      }));
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to save to database',
        success: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Upload</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload Excel files to process student results
            </p>
          </div>
          
          <div 
            className={`border-dashed border-2 rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } transition-colors duration-200 ease-in-out`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <FiUpload className="text-4xl text-blue-500 mb-3" />
              <p className="text-gray-700 mb-3">
                {uploadState.fileName ? (
                  <>Selected file: <span className="font-semibold">{uploadState.fileName}</span></>
                ) : (
                  <>Drag and drop your Excel file here or click to browse</>
                )}
              </p>
              
              <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 ease-in-out">
                Browse Files
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadState.isLoading}
                />
              </label>
              
              <p className="mt-3 text-xs text-gray-500">
                Only .xlsx files are supported
              </p>
            </div>
          </div>
          
          {uploadState.isLoading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Processing...</span>
                <span className="text-sm font-medium text-blue-600">{uploadState.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-600">Converting Excel data and preparing for upload...</p>
            </div>
          )}

          {uploadState.error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Upload failed</h3>
                  <p className="text-sm text-red-700 mt-1">{uploadState.error}</p>
                </div>
              </div>
            </div>
          )}

          {uploadState.success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Data saved successfully!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    The data has been processed and saved to the database.
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadState.isProcessed && uploadState.processedData && (
            <div className="mt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-700">
                  File has been processed. Review the data and click below to save to database.
                </p>
              </div>
              
              <button
                onClick={handleSaveToDatabase}
                disabled={uploadState.isSaving}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${uploadState.isSaving 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200 ease-in-out`}
              >
                {uploadState.isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving to Database...
                  </>
                ) : (
                  'Save to Database'
                )}
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
