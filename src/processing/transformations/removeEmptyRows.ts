import type { CsvDataset } from '../../domain/csv';

export function removeEmptyRows(dataset: CsvDataset): { dataset: CsvDataset, removedCount: number } {
  // Dùng filter để tạo mảng mới, không sửa mảng gốc
  const newRows = dataset.rows.filter(row => {
    const isEmpty = row.every(cell => cell.trim() === "");
    return !isEmpty; // Giữ lại các dòng không trống
  });

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