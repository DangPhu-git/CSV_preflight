import type { CsvDataset } from '../../domain/csv';

export function normalizeHeaders(dataset: CsvDataset, customHeaderMap?: Record<string, string>): { dataset: CsvDataset, normalizedCount: number } {
  let normalizedCount = 0;
  
  // Dùng Map để đếm số lần xuất hiện của mỗi tên cột
  const seenHeaders = new Map<string, number>();

  const newHeaders = dataset.headers.map((header, index) => {
    //Ưu tiên lấy tên custom do người dùng nhập (nếu có và không rỗng)
    if (customHeaderMap && customHeaderMap[index] !== undefined && customHeaderMap[index].trim() !== "") {
      normalizedCount++;
      return customHeaderMap[index].trim();
    }
    
    let newHeader = header.trim();
    let isModified = false;

    // 1. Sửa lỗi Empty Header -> Đổi thành "Column_X"
    if (newHeader === "") {
      newHeader = `Column_${index + 1}`;
      isModified = true;
    }

    // 2. Sửa lỗi Duplicate Header -> Thêm hậu tố "_2", "_3"
    if (seenHeaders.has(newHeader)) {
      const count = seenHeaders.get(newHeader)! + 1;
      seenHeaders.set(newHeader, count);
      newHeader = `${newHeader}_${count}`;
      isModified = true;
    } else {
      seenHeaders.set(newHeader, 1);
    }

    // 3. Nếu header thay đổi (do Trim, do Empty, hoặc do Duplicate), tăng biến đếm
    if (isModified || newHeader !== header) {
      normalizedCount++;
    }

    return newHeader;
  });

  return {
    dataset: {
      ...dataset,
      headers: newHeaders
    },
    normalizedCount
  };
}