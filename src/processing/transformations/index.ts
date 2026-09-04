import  type { CsvDataset } from '../../domain/csv';
import type { FixSelection, TransformationResult, ChangeSummary } from '../../domain/fix';
import { removeEmptyRows } from './removeEmptyRows';
import { removeDuplicateRows } from './removeDuplicateRows';
import { trimWhitespace } from './trimWhitespace';
import { normalizeHeaders } from './normalizeHeaders';

export function applyTransformations(original: CsvDataset, selection: FixSelection): TransformationResult {
  let currentDataset = original; // Dữ liệu sẽ chảy qua từng ống (pipe)
  
  const changes: ChangeSummary = {
    rowsRemoved: 0,
    cellsCleaned: 0,
    headersNormalized: 0
  };

  // Thứ tự thực hiện (Execution Order) chuẩn theo SDS 6.12
  if (selection.removeEmptyRows) {
    const result = removeEmptyRows(currentDataset);
    currentDataset = result.dataset;
    changes.rowsRemoved += result.removedCount;
  }

  if (selection.removeDuplicateRows) {
    const result = removeDuplicateRows(currentDataset);
    currentDataset = result.dataset;
    changes.rowsRemoved += result.removedCount;
  }

  if (selection.trimWhitespace) {
    const result = trimWhitespace(currentDataset);
    currentDataset = result.dataset;
    changes.cellsCleaned += result.cleanedCount;
  }

  if (selection.normalizeHeaders) {
    const result = normalizeHeaders(currentDataset, selection.customHeaderMap);    
    currentDataset = result.dataset;
    changes.headersNormalized += result.normalizedCount;
  }

  return {
    original, // Giữ nguyên bản gốc
    transformed: currentDataset, // Phiên bản đã được xử lý qua chuỗi pipeline
    changes
  };
}