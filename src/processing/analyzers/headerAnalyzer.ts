import type { CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';

export function analyzeHeaders(dataset: CsvDataset): CsvIssue[] {
  const issues: CsvIssue[] = [];
  let emptyCount = 0;
  let duplicateCount = 0;
  let whitespaceCount = 0;

  const seen = new Set<string>();

  for (const header of dataset.headers) {
    const trimmed = header.trim();
    
    if (trimmed === "") {
      emptyCount++;
    }

    // Đánh giá trùng lặp trên giá trị gốc, chưa qua chuẩn hóa (DA-006)
    if (seen.has(header)) {
      duplicateCount++;
    } else {
      seen.add(header);
    }

    // Kiểm tra khoảng trắng thừa
    if (header !== trimmed) {
      whitespaceCount++;
    }
  }

  if (emptyCount > 0) {
    issues.push({ type: "EMPTY_HEADER", severity: "warning", count: emptyCount, description: `Found ${emptyCount} empty header(s)`, fixAvailable: true });
  }
  if (duplicateCount > 0) {
    issues.push({ type: "DUPLICATE_HEADER", severity: "warning", count: duplicateCount, description: `Found ${duplicateCount} duplicate header(s)`, fixAvailable: true });
  }
  if (whitespaceCount > 0) {
    issues.push({ type: "EXTRA_WHITESPACE", severity: "warning", count: whitespaceCount, description: `Found ${whitespaceCount} header(s) with extra whitespace`, fixAvailable: true });
  }

  return issues;
}