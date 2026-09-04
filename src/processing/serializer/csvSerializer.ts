// src/processing/serializer/csvSerializer.ts
import type { CsvDataset } from '../../domain/csv';

export function serializeCsv(dataset: CsvDataset): string {
  const lines: string[] = [];

  // Hàm escape các ô chứa dấu phẩy, dấu nháy kép hoặc xuống dòng
  const escapeCell = (cell: string): string => {
    if (cell === null || cell === undefined) return '';
    const stringCell = String(cell);
    
    // Nếu ô chứa dấu phẩy, dấu nháy kép, hoặc ký tự xuống dòng -> Phải bọc trong dấu ngoặc kép
    if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n') || stringCell.includes('\r')) {
      // Escape dấu nháy kép bằng cách nhân đôi ("")
      return `"${stringCell.replace(/"/g, '""')}"`;
    }
    return stringCell;
  };

  // 1. Serialize Headers
  const headerLine = dataset.headers.map(escapeCell).join(',');
  lines.push(headerLine);

  // 2. Serialize Rows
  for (const row of dataset.rows) {
    const rowLine = row.map(escapeCell).join(',');
    lines.push(rowLine);
  }

  // Ghép các dòng lại bằng ký tự xuống dòng chuẩn
  return lines.join('\n');
}