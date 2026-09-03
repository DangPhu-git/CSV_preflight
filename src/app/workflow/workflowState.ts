// src/app/workflow/workflowState.ts
import type { CsvDocument, CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';
import type { FixSelection, ChangeSummary } from '../../domain/fix';

// Định nghĩa 8 trạng thái hợp lệ của UI dựa theo tài liệu thiết kế (SDS)
export type WorkflowStatus =
  | "UPLOAD"
  | "PARSING"
  | "ANALYZING"
  | "ANALYSIS_RESULT"
  | "APPLYING_FIXES"
  | "PREVIEW"
  | "EXPORT_COMPLETE"
  | "ERROR";

export type AppErrorCode =
  | "FILE_MISSING"
  | "UNSUPPORTED_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "FILE_UNREADABLE"
  | "INVALID_CSV"
  | "EMPTY_CSV"
  | "PROCESSING_FAILURE"
  | "EXPORT_FAILURE";

export interface UserFacingError {
  code: AppErrorCode;
  message: string;
  recoverable: boolean;
}

// Cấu trúc State tổng lưu trữ toàn bộ dữ liệu của Session
export interface WorkflowState {
  status: WorkflowStatus;
  originalFile?: File;
  originalDocument?: CsvDocument;
  transformedDataset?: CsvDataset;
  issues?: CsvIssue[];
  selectedFixes?: FixSelection;
  changeSummary?: ChangeSummary;
  error?: UserFacingError;
}

// Danh sách các Action để thay đổi State (dùng kỹ thuật Discriminated Unions của TS)
export type WorkflowAction =
  | { type: "FILE_SELECTED"; file: File }
  | { type: "PARSE_START" }
  | { type: "PARSE_SUCCESS"; document: CsvDocument }
  | { type: "ANALYZE_START" }
  | { type: "ANALYZE_SUCCESS"; issues: CsvIssue[] }
  | { type: "SELECT_FIXES"; fixes: FixSelection }
  | { type: "TRANSFORM_START" }
  | { type: "TRANSFORM_SUCCESS"; transformed: CsvDataset; changes: ChangeSummary }
  | { type: "EXPORT_SUCCESS" }
  | { type: "ERROR"; error: UserFacingError }
  | { type: "RESET" };