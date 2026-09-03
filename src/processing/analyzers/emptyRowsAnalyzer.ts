import type { CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';

export function analyzeEmptyRows(dataset: CsvDataset): CsvIssue[] {
  let emptyCount = 0;

  for (const row of dataset.rows) {
    // Dòng trống là dòng mà TẤT CẢ các ô đều là chuỗi rỗng hoặc chỉ chứa khoảng trắng
    const isEmpty = row.every(cell => cell.trim() === "");
    if (isEmpty) {
      emptyCount++;
    }
  }

  if (emptyCount > 0) {
    return [{
      type: "EMPTY_ROWS",
      severity: "warning",
      count: emptyCount,
      description: `Found ${emptyCount} empty row(s)`,
      fixAvailable: true
    }];
  }
  return [];
}