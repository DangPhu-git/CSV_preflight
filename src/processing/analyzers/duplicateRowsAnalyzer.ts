import type { CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';

export function analyzeDuplicateRows(dataset: CsvDataset): CsvIssue[] {
  let duplicateCount = 0;
  // Dùng Set (Hash Map) để tăng tốc độ so sánh (O(n) thay vì O(n^2))
  const seen = new Set<string>();

  for (const row of dataset.rows) {
    // Chuyển dòng thành chuỗi JSON để so sánh chính xác tuyệt đối (exact match)
    // Lưu ý: "Alice" và " Alice " sẽ tạo ra 2 chuỗi JSON khác nhau -> Không tính là trùng
    // const key = JSON.stringify(row);
const key = row.join('\x00');    
    if (seen.has(key)) {
      duplicateCount++; // Dòng lặp lại từ lần thứ 2 trở đi mới bị tính là lỗi
    } else {
      seen.add(key);
    }
  }

  if (duplicateCount > 0) {
    return [{
      type: "DUPLICATE_ROWS",
      severity: "warning",
      count: duplicateCount,
      description: `Found ${duplicateCount} exact duplicate row(s)`,
      fixAvailable: true
    }];
  }
  return [];
}