import Papa from 'papaparse';
import type { CsvDataset, CsvDocument } from '../../domain/csv';

/**
 * Đọc file CSV và chuyển đổi thành cấu trúc CsvDocument.
 * Hàm này trả về một Promise để xử lý bất đồng bộ.
 */
export function parseCsv(file: File): Promise<CsvDocument> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false, // Trả về mảng 2 chiều string[][] thay vì JSON object
      skipEmptyLines: false, // Phải giữ lại để (EmptyRowsAnalyzer) phát hiện lỗi
      worker: false, // Sẽ được wrap bằng Browser Web Worker ở layer cao hơn
      
      complete: (results) => {
        const data = results.data;
        
        // Kiểm tra file rỗng (không có dòng nào)
        if (!data || data.length === 0) {
          return reject(new Error("EMPTY_CSV"));
        }

        // Dòng đầu tiên luôn được coi là Header
        const headers = data[0] || [];
        // Các dòng còn lại là Data Rows
        const rows = data.slice(1);

        const dataset: CsvDataset = {
          headers,
          rows,
          rowCount: rows.length,
          columnCount: headers.length,
        };

        const document: CsvDocument = {
          fileName: file.name,
          fileSize: file.size,
          dataset,
          issues: [], // Vấn đề sẽ được Analyzer đổ vào sau
        };

        resolve(document);
      },
      
      error: (error) => {
        // Ánh xạ lỗi của PapaParse thành mã lỗi nội bộ 
        reject(new Error("INVALID_CSV"));
      }
    });
  });
}