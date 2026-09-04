// src/processing/worker/workerAdapter.ts
import type { CsvDataset, CsvDocument } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';
import type { FixSelection, TransformationResult } from '../../domain/fix';
import { parseCsv } from '../parser/csvParser';
import { runAllAnalyzers } from '../analyzers';
import { applyTransformations } from '../transformations';

/**
 * Xử lý parse và phân tích file bất đồng bộ (tránh đơ UI bằng Promise micro-task)
 */
export async function parseAndAnalyze(file: File): Promise<{ document: CsvDocument; issues: CsvIssue[] }> {
  console.log("WorkerAdapter: Bắt đầu parse file trực tiếp...");
  
  // Sử dụng setTimeout 0 để nhường luồng cho UI render trạng thái Loading trước khi parse nặng
  await new Promise(resolve => setTimeout(resolve, 50));

  const document = await parseCsv(file);
  const issues = runAllAnalyzers(document.dataset);
  document.issues = issues;

  console.log("WorkerAdapter: Parse và phân tích hoàn tất!", { document, issues });
  return { document, issues };
}

/**
 * Xử lý làm sạch dữ liệu bất đồng bộ
 */
export async function applyFixes(dataset: CsvDataset, fixes: FixSelection): Promise<TransformationResult> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const result = applyTransformations(dataset, fixes);
  return result;
}