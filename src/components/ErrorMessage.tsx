// src/components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { UserFacingError } from '../app/workflow/workflowState';

interface ErrorMessageProps {
  error: UserFacingError;
  onRetry: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl border border-red-100">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Processing Error</h3>
      <p className="text-red-600 text-center mb-6">{error.message}</p>
      
      {error.recoverable && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          Choose another file
        </button>
      )}
    </div>
  );
}