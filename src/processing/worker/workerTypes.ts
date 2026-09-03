// src/processing/worker/workerTypes.ts
import type { CsvDataset, CsvDocument } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';
import type { FixSelection, TransformationResult } from '../../domain/fix';

// Các lệnh UI gửi cho Worker
export type WorkerCommand =
  | { type: "PARSE_AND_ANALYZE"; file: File }
  | { type: "APPLY_FIXES"; dataset: CsvDataset; fixes: FixSelection };

// Các kết quả Worker gửi trả lại UI
export type WorkerResponse =
  | { type: "PARSE_AND_ANALYZE_SUCCESS"; document: CsvDocument; issues: CsvIssue[] }
  | { type: "TRANSFORM_SUCCESS"; result: TransformationResult }
  | { type: "PROCESSING_ERROR"; message: string; errorCode: string };