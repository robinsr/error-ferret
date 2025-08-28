import type { ChangeEvent } from 'react';
import React, { useState, useRef } from 'react';
import { FilePlus } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@errorferret/constants';


interface Props {
  selectedFiles: File[];
  onFilesChange?: (files: File[]) => void;
}

const FileUploadInput: React.FC<Props> = ({ selectedFiles, onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTypes = SUPPORTED_LANGUAGES.map(lang => lang.ext).join(',');
  const supportedLanguages = SUPPORTED_LANGUAGES.map(lang => lang.label).join(', ');

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesChange?.(files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesChange?.(newFiles);
  };

  return (
    <div>
      <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-3">
        Upload Files
      </label>

      <div className="mt-2">
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
          <div className="space-y-1 text-center">

            <FilePlus className="mx-auto h-12 w-12" strokeWidth={1.0} />

            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="files"
                  type="file"
                  multiple
                  accept={fileTypes}
                  className="sr-only"
                  onChange={handleFileSelection}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              Supports: {supportedLanguages}
            </p>
          </div>
        </div>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.0}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{`${(file.size / 1024).toFixed(1)} KB`}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.0}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadInput;
