import React, { useReducer } from 'react';
import { workflowReducer, initialState } from './workflow/workflowReducer';
import type { UserFacingError } from './workflow/workflowState';
import { parseAndAnalyze } from '../processing/worker/workerAdapter';
import FileDropZone from '../components/FileDropZone';
import ErrorMessage from '../components/ErrorMessage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Xử lý khi user chọn file hợp lệ (pass qua FileValidation)
  const handleValidFile = async (file: File) => {
    console.log("1. App: Bắt đầu xử lý file:", file.name, "Dung lượng:", file.size);
    dispatch({ type: 'FILE_SELECTED', file });
    dispatch({ type: 'PARSE_START' });

    try {
      console.log("2. App: Đang gọi parseAndAnalyze trong workerAdapter...");
      // Gọi Web Worker để xử lý file ở luồng nền (tránh đơ UI)
      const { document, issues } = await parseAndAnalyze(file);

      console.log("5. App: Worker trả về thành công!", { document, issues });
      dispatch({ type: 'PARSE_SUCCESS', document });
      dispatch({ type: 'ANALYZE_SUCCESS', issues });
    } catch (err: any) {
      // Map lỗi từ Worker về UI Error format
      let message = "An unexpected error occurred.";
      if (err.message === "INVALID_CSV") message = "This file could not be read as a valid CSV.";
      if (err.message === "EMPTY_CSV") message = "This CSV doesn't contain any data.";

      dispatch({
        type: 'ERROR',
        error: { code: err.message, message, recoverable: true }
      });
    }
  };

  const handleError = (error: UserFacingError) => {
    dispatch({ type: 'ERROR', error });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header (Luôn hiển thị) */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">CSV Preflight & Cleaner</h1>
          <p className="text-blue-100 mt-1">Detect common CSV problems, fix them, and download a clean file.</p>
        </div>

        {/* Content Area (Thay đổi theo trạng thái) */}
        <div className="p-8">
          {state.status === 'UPLOAD' && (
            <FileDropZone 
              onValidFileSelected={handleValidFile} 
              onError={handleError} 
            />
          )}

          {(state.status === 'PARSING' || state.status === 'ANALYZING') && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-800">
                {state.status === 'PARSING' ? 'Reading CSV file...' : 'Analyzing data...'}
              </h3>
              <p className="text-gray-500 text-sm mt-2">This happens locally in your browser.</p>
            </div>
          )}

          {state.status === 'ERROR' && state.error && (
            <ErrorMessage error={state.error} onRetry={handleReset} />
          )}

          {/* Các trạng thái tiếp theo (ANALYSIS_RESULT, PREVIEW) sẽ được implement ở bước sau */}
          {state.status === 'ANALYSIS_RESULT' && state.originalDocument && (
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-green-600 mb-4">✅ Đọc file CSV thành công!</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700 space-y-1">
                <p><strong>Tên file:</strong> {state.originalDocument.fileName}</p>
                <p><strong>Tổng số dòng dữ liệu:</strong> {state.originalDocument.dataset.rowCount}</p>
                <p><strong>Tổng số cột:</strong> {state.originalDocument.dataset.columnCount}</p>
                <p><strong>Headers:</strong> {state.originalDocument.dataset.headers.join(' | ')}</p>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">Các vấn đề phát hiện được ({state.issues?.length || 0}):</h3>
              {state.issues && state.issues.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-600 mb-6">
                  {state.issues.map((issue, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{issue.type}:</span> {issue.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-500 mb-6">✨ File của bạn hoàn toàn sạch sẽ, không có lỗi phổ biến nào!</p>
              )}

              <button
                onClick={() => console.log("Dataset chi tiết:", state.originalDocument?.dataset)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                In Dataset ra Console (F12)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}