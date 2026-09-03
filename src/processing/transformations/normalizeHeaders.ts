import type { CsvDataset } from '../../domain/csv';

export function normalizeHeaders(dataset: CsvDataset): { dataset: CsvDataset, normalizedCount: number } {
  let normalizedCount = 0;

  // Theo DA-006, MVP chỉ hỗ trợ trim header
  const newHeaders = dataset.headers.map(header => {
    const trimmed = header.trim();
    if (trimmed !== header) {
      normalizedCount++;
    }
    return trimmed;
  });

  return {
    dataset: {
      ...dataset,
      headers: newHeaders
    },
    normalizedCount
  };
}