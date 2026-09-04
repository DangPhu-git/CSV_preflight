// src/features/csv-cleaner/analysis/AnalysisResultView.tsx
import React, { useState, useMemo } from 'react';
import type { CsvDocument } from '../../../domain/csv';
import type { CsvIssue } from '../../../domain/issue';
import type { FixSelection } from '../../../domain/fix';
import IssueCard from '../../../components/IssueCard';
import { FileText, Columns, Rows, CheckCircle, Edit3 } from 'lucide-react';

interface AnalysisResultViewProps {
  document: CsvDocument;
  issues: CsvIssue[];
  onApplyFixes: (fixes: FixSelection) => void;
  onDownloadOriginal: () => void;
}

export default function AnalysisResultView({ 
  document, 
  issues, 
  onApplyFixes,
  onDownloadOriginal 
}: AnalysisResultViewProps) {
  
  // Khởi tạo trạng thái mặc định của các fix dựa trên việc lỗi đó có tồn tại hay không
  const hasEmptyRows = issues.some(i => i.type === 'EMPTY_ROWS');
  const hasDuplicates = issues.some(i => i.type === 'DUPLICATE_ROWS');
  const hasWhitespace = issues.some(i => i.type === 'EXTRA_WHITESPACE');
  const hasHeaderIssues = issues.some(i => i.type === 'EMPTY_HEADER' || i.type === 'DUPLICATE_HEADER' || i.type === 'EXTRA_WHITESPACE');

  const [selection, setSelection] = useState<FixSelection>({
    removeEmptyRows: hasEmptyRows,
    removeDuplicateRows: hasDuplicates,
    trimWhitespace: hasWhitespace || hasHeaderIssues, // Trim luôn cho header nếu có lỗi header
    normalizeHeaders: hasHeaderIssues,
    customHeaderMap: {},
  });

  const problematicHeaders = useMemo(() => {
    const seen = new Map<string, number>();
    const list: { index: number; original: string; issueType: string }[] = [];
    
    document.dataset.headers.forEach((h, idx) => {
      const trimmed = h.trim();
      if (trimmed === "") {
        list.push({ index: idx, original: `(Empty Column ${idx + 1})`, issueType: "Empty Header" });
      } else if (seen.has(h)) {
        list.push({ index: idx, original: h, issueType: "Duplicate Header" });
      } else {
        seen.set(h, idx);
      }
    });
    return list;
  }, [document]);

  const handleCustomHeaderChange = (index: number, value: string) => {
    setSelection(prev => ({
      ...prev,
      customHeaderMap: {
        ...prev.customHeaderMap,
        [index]: value
      }
    }));
  };

  const handleApply = () => {
    onApplyFixes(selection);
  };

  // FR-015: Handle Clean CSV
  if (issues.length === 0) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your CSV looks good.</h2>
        <p className="text-gray-600 mb-8">No common problems were detected.</p>
        <button
          onClick={onDownloadOriginal}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download original CSV
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* File Stats */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center text-gray-700">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium truncate max-w-[200px]" title={document.fileName}>{document.fileName}</span>
        </div>
        <div className="flex items-center text-gray-700 ml-auto">
          <Rows className="h-5 w-5 mr-2 text-blue-500" />
          <span>{document.dataset.rowCount.toLocaleString()} rows</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Columns className="h-5 w-5 mr-2 text-blue-500" />
          <span>{document.dataset.columnCount.toLocaleString()} columns</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Issues */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            Problems found <span className="ml-2 bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded-full">{issues.length}</span>
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {issues.map((issue, idx) => (
              <IssueCard key={`${issue.type}-${idx}`} issue={issue} />
            ))}
          </div>
        </div>

        {/* Right Column: Fix Selection */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Select fixes to apply</h3>
            
            <div className="space-y-4 mb-8">
              <label className={`flex items-start space-x-3 p-3 rounded-lg border ${hasEmptyRows ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                  checked={selection.removeEmptyRows}
                  disabled={!hasEmptyRows}
                  onChange={e => setSelection({...selection, removeEmptyRows: e.target.checked})}
                />
                <div>
                  <p className="font-medium text-gray-800">Remove empty rows</p>
                  <p className="text-sm text-gray-500">Deletes rows containing no data.</p>
                </div>
              </label>

              <label className={`flex items-start space-x-3 p-3 rounded-lg border ${hasDuplicates ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                  checked={selection.removeDuplicateRows}
                  disabled={!hasDuplicates}
                  onChange={e => setSelection({...selection, removeDuplicateRows: e.target.checked})}
                />
                <div>
                  <p className="font-medium text-gray-800">Remove duplicate rows</p>
                  <p className="text-sm text-gray-500">Keeps the first occurrence, deletes the rest.</p>
                </div>
              </label>

              <label className={`flex items-start space-x-3 p-3 rounded-lg border ${hasWhitespace ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                  checked={selection.trimWhitespace}
                  disabled={!hasWhitespace && !hasHeaderIssues}
                  onChange={e => setSelection({...selection, trimWhitespace: e.target.checked})}
                />
                <div>
                  <p className="font-medium text-gray-800">Trim whitespace</p>
                  <p className="text-sm text-gray-500">Removes hidden spaces at the start/end of cells.</p>
                </div>
              </label>

              <label className={`flex items-start space-x-3 p-3 rounded-lg border ${hasHeaderIssues ? 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                  checked={selection.normalizeHeaders}
                  disabled={!hasHeaderIssues}
                  onChange={e => setSelection({...selection, normalizeHeaders: e.target.checked})}
                />
                <div>
                  <p className="font-medium text-gray-800">Normalize headers</p>
                  <p className="text-sm text-gray-500">Cleans up header column names.</p>
                </div>
              </label>
              {/* Normalize Headers Block với Sub-inputs tùy chỉnh */}
              <div className={`p-3 rounded-lg border ${hasHeaderIssues ? 'bg-gray-50 border-gray-200' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 h-4 w-4 text-blue-600 rounded"
                    checked={selection.normalizeHeaders}
                    disabled={!hasHeaderIssues}
                    onChange={e => setSelection({...selection, normalizeHeaders: e.target.checked})}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Normalize headers</p>
                    <p className="text-sm text-gray-500">Cleans up and auto-renames header column names.</p>
                  </div>
                </label>

                {/* Sub-inputs hiển thị khi Normalize headers được chọn và file có cột lỗi */}
                {selection.normalizeHeaders && problematicHeaders.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 pl-7">
                    <p className="text-xs font-semibold text-gray-600 uppercase flex items-center">
                      <Edit3 className="h-3.5 w-3.5 mr-1 text-blue-500" /> Optional: Custom Rename Problematic Headers
                    </p>
                    {problematicHeaders.map(item => (
                      <div key={item.index} className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 w-28 truncate" title={item.original}>
                          {item.original} <span className="text-[10px] text-amber-600">({item.issueType})</span>:
                        </span>
                        <input
                          type="text"
                          placeholder={`Enter name for col ${item.index + 1}`}
                          className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                          value={selection.customHeaderMap?.[item.index] || ''}
                          onChange={e => handleCustomHeaderChange(item.index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
            
          <button
            onClick={handleApply}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Apply selected fixes
          </button>
        </div>
      </div>
    </div>
  );
}