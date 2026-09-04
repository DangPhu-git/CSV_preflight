// src/services/fileValidation.ts
import type { AppErrorCode } from '../app/workflow/workflowState';

export interface FileValidationResult {
  valid: boolean;
  code?: AppErrorCode;
  message?: string;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB[cite: 1, 2]

export function validateFile(file: File | undefined | null): FileValidationResult {
  if (!file) {
    return { valid: false, code: "FILE_MISSING", message: "No file selected." };
  }

  // Kiểm tra đuôi file (chỉ hỗ trợ .csv trong MVP P0)[cite: 1, 2]
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { 
      valid: false, 
      code: "UNSUPPORTED_FILE_TYPE", 
      message: "Please select a .csv file." 
    };
  }

  // Kiểm tra dung lượng (giới hạn 20MB)[cite: 1, 2]
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      code: "FILE_TOO_LARGE", 
      message: "This file is too large. Maximum file size: 20 MB." 
    };
  }

  return { valid: true };
}