// src/app/workflow/workflowReducer.ts
import type { WorkflowState, WorkflowAction } from './workflowState';

// Trạng thái khởi tạo khi vừa mở web
export const initialState: WorkflowState = {
  status: "UPLOAD",
};

export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "FILE_SELECTED":
      // Reset toàn bộ state cũ, bắt đầu lại với file mới
      return { ...initialState, originalFile: action.file };
      
    case "PARSE_START":
      return { ...state, status: "PARSING", error: undefined };
      
    case "PARSE_SUCCESS":
      // Sau khi parse xong, lập tức chuyển sang trạng thái Analyzing
      return { ...state, status: "ANALYZING", originalDocument: action.document };
      
    case "ANALYZE_START":
      return { ...state, status: "ANALYZING" };
      
    case "ANALYZE_SUCCESS":
      return { ...state, status: "ANALYSIS_RESULT", issues: action.issues };
      
    case "SELECT_FIXES":
      // Lưu trữ lựa chọn của User, chưa thay đổi trạng thái UI
      return { ...state, selectedFixes: action.fixes };
      
    case "TRANSFORM_START":
      return { ...state, status: "APPLYING_FIXES", error: undefined };
      
    case "TRANSFORM_SUCCESS":
      return { 
        ...state, 
        status: "PREVIEW", 
        transformedDataset: action.transformed, 
        changeSummary: action.changes 
      };
      
    case "EXPORT_SUCCESS":
      return { ...state, status: "EXPORT_COMPLETE" };
      
    case "ERROR":
      return { ...state, status: "ERROR", error: action.error };
      
    case "RESET":
      // Trở về màn hình Upload
      return initialState;
      
    default:
      return state;
  }
}