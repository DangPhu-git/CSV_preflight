// src/services/downloadService.ts
import type { CsvDataset } from '../domain/csv';
import { serializeCsv } from '../processing/serializer/csvSerializer';

export function downloadCleanedCsv(dataset: CsvDataset, originalFileName: string): void {
  // 1. Chuyển dataset thành chuỗi CSV
  const csvString = serializeCsv(dataset);

  // 2. Tạo Blob với định dạng text/csv và chuẩn mã hóa UTF-8 (kèm BOM để Excel hiển thị đúng tiếng Việt nếu có)
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvString], { type: 'text/csv;charset=utf-8;' });

  // 3. Tạo URL tạm thời cho Blob
  const url = URL.createObjectURL(blob);

  // 4. Xử lý tên file theo chuẩn: original-name-cleaned.csv
  const baseName = originalFileName.replace(/\.[^/.]+$/, ""); // Xóa đuôi cũ (.csv)
  const cleanedFileName = `${baseName}-cleaned.csv`;

  // 5. Tạo thẻ <a> ẩn để trigger lệnh click download của trình duyệt
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', cleanedFileName);
  document.body.appendChild(link);
  
  link.click();

  // 6. Dọn dẹp DOM và giải phóng bộ nhớ URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}