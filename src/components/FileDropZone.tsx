// src/components/FileDropZone.tsx
import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { validateFile } from '../services/fileValidation';
import type { UserFacingError } from '../app/workflow/workflowState';

interface FileDropZoneProps {
  onValidFileSelected: (file: File) => void;
  onError: (error: UserFacingError) => void;
}

export default function FileDropZone({ onValidFileSelected, onError }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined | null) => {
    const validation = validateFile(file);
    if (validation.valid && file) {
      onValidFileSelected(file);
    } else if (validation.code && validation.message) {
      onError({ code: validation.code, message: validation.message, recoverable: true });
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // Reset value để có thể chọn lại cùng một file nếu cần
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
      `}
    >
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileInputChange}
      />
      <div className="flex justify-center mb-4">
        <UploadCloud className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Click to upload or drag and drop
      </h3>
      <p className="text-sm text-gray-500">
        Only .csv files up to 20MB are supported
      </p>
    </div>
  );
}