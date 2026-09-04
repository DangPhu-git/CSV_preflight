import type { CsvDataset } from '../../domain/csv';

export function removeDuplicateRows(dataset: CsvDataset): { dataset: CsvDataset, removedCount: number } {
  const seen = new Set<string>();
  const newRows: string[][] = [];

  for (const row of dataset.rows) {
    const key = JSON.stringify(row);
    // Theo DA-007: Giữ lại lần xuất hiện đầu tiên, bỏ qua các lần sau
    if (!seen.has(key)) {
      seen.add(key);
      newRows.push(row);
    }
  }

  const removedCount = dataset.rowCount - newRows.length;

  return {
    dataset: {
      ...dataset,
      rows: newRows,
      rowCount: newRows.length
    },
    removedCount
  };
}