import type { CsvDataset } from '../../domain/csv';

export function trimWhitespace(dataset: CsvDataset): { dataset: CsvDataset, cleanedCount: number } {
  let cleanedCount = 0;

  // Map tạo ra mảng mới hoàn toàn, an toàn cho bộ nhớ gốc
  const newRows = dataset.rows.map(row => {
    return row.map(cell => {
      const trimmed = cell.trim();
      if (trimmed !== cell) {
        cleanedCount++;
      }
      return trimmed;
    });
  });

  return {
    dataset: {
      ...dataset,
      rows: newRows
    },
    cleanedCount
  };
}