import React, { useState } from 'react';
import { convertExcelToJson, uploadToBackend } from '../utils/excelHelpers';
import { FiUpload, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface UploadState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fileName: string | null;
  progress: number;
}

const AdminUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isLoading: false,
    error: null,
    success: false,
    fileName: null,
    progress: 0
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
      isLoading: true,
      error: null,
      success: false,
      fileName: file.name,
      progress: 10
    });

    try {
      // Update progress to simulate processing
      setUploadState(prev => ({ ...prev, progress: 30 }));
      
      // Convert Excel to JSON
      const jsonData = await convertExcelToJson(file);
      
      setUploadState(prev => ({ ...prev, progress: 70 }));
      
      // Send to backend
      await uploadToBackend(jsonData);

      setUploadState({
        isLoading: false,
        error: null,
        success: true,
        fileName: file.name,
        progress: 100
      });
    } catch (error) {
      setUploadState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false,
        fileName: file.name,
        progress: 0
      });
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
                  <h3 className="text-sm font-medium text-green-800">Upload successful!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    The file has been processed and data is ready for use.
                  </p>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
