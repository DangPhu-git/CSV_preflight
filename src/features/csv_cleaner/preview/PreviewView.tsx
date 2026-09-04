// src/features/csv-cleaner/preview/PreviewView.tsx
import React from 'react';
import type { CsvDocument, CsvDataset } from '../../../domain/csv';
import type { ChangeSummary } from '../../../domain/fix';
import PreviewTable from '../../../components/PreviewTable';
import { Download, ArrowRight, BarChart3, Eraser, AlignLeft } from 'lucide-react';

interface PreviewViewProps {
  originalDocument: CsvDocument;
  transformedDataset: CsvDataset;
  changeSummary: ChangeSummary;
  onDownload: () => void;
  onStartOver: () => void;
}

export default function PreviewView({
  originalDocument,
  transformedDataset,
  changeSummary,
  onDownload,
  onStartOver
}: PreviewViewProps) {
  
  const origRows = originalDocument.dataset.rowCount;
  const newRows = transformedDataset.rowCount;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Preview Results</h2>
          <p className="text-gray-500 mt-1">Review your cleaned dataset before downloading.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onStartOver}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={onDownload}
            className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Clean CSV
          </button>
        </div>
      </div>

      {/* Change Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <BarChart3 className="h-6 w-6 text-blue-500 mb-2" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rows</span>
          <div className="flex items-center mt-1">
            <span className="text-lg font-bold text-gray-400 line-through mr-2">{origRows}</span>
            <ArrowRight className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-2xl font-bold text-blue-600">{newRows}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <Eraser className="h-6 w-6 text-amber-500 mb-2" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rows Removed</span>
          <span className="text-2xl font-bold text-amber-600 mt-1">{changeSummary.rowsRemoved}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <AlignLeft className="h-6 w-6 text-emerald-500 mb-2" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cells Cleaned</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1">{changeSummary.cellsCleaned}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
          <div className="flex font-bold text-purple-500 mb-2 font-mono text-xl">H1</div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Headers Fixed</span>
          <span className="text-2xl font-bold text-purple-600 mt-1">{changeSummary.headersNormalized}</span>
        </div>
      </div>

      {/* Data Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Data Preview</h3>
        <PreviewTable dataset={transformedDataset} maxRows={100} />
      </div>
    </div>
  );
}