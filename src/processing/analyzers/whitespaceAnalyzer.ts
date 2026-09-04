import type { CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';

export function analyzeWhitespace(dataset: CsvDataset): CsvIssue[] {
  let affectedCellCount = 0;

  for (const row of dataset.rows) {
    for (const cell of row) {
      // Chỉ kiểm tra khoảng trắng ở đầu hoặc cuối chuỗi
      if (cell !== cell.trim()) {
        affectedCellCount++;
      }
    }
  }

  if (affectedCellCount > 0) {
    return [{
      type: "EXTRA_WHITESPACE",
      severity: "warning",
      count: affectedCellCount,
      description: `Found ${affectedCellCount} cell(s) with extra whitespace`,
      fixAvailable: true
    }];
  }
  return [];
}