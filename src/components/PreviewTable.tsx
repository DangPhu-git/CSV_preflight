// src/components/PreviewTable.tsx
import React from 'react';
import type { CsvDataset } from '../domain/csv';

interface PreviewTableProps {
  dataset: CsvDataset;
  maxRows?: number; // Mặc định 100 theo SDS
}

export default function PreviewTable({ dataset, maxRows = 100 }: PreviewTableProps) {
  // Chỉ lấy tối đa 100 dòng để render, tránh crash DOM
  const displayRows = dataset.rows.slice(0, maxRows);
  const hasMore = dataset.rows.length > maxRows;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 border-b border-gray-200 w-12 text-gray-400">#</th>
              {dataset.headers.map((header, idx) => (
                <th key={idx} className="px-4 py-3 border-b border-gray-200 font-semibold">
                  {header || <span className="text-red-400 italic">(empty)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={dataset.headers.length + 1} className="px-4 py-8 text-center text-gray-500 italic">
                  Dataset is empty after cleaning.
                </td>
              </tr>
            ) : (
              displayRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-2 text-gray-400 border-r border-gray-100 bg-gray-50/50">
                    {rowIndex + 1}
                  </td>
                  {/* Map theo số cột của header để bảng không bị so le */}
                  {dataset.headers.map((_, colIndex) => {
                    const cellValue = row[colIndex] ?? "";
                    return (
                      <td key={colIndex} className="px-4 py-2 text-gray-800">
                        {cellValue === "" ? <span className="text-gray-300 italic">-</span> : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="bg-gray-50 px-4 py-3 text-center text-sm text-gray-500 border-t border-gray-200">
          Showing first {maxRows} rows of {dataset.rowCount.toLocaleString()} total rows.
        </div>
      )}
    </div>
  );
}