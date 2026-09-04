import type { CsvDataset } from '../../domain/csv';
import type { CsvIssue } from '../../domain/issue';
import { analyzeEmptyRows } from './emptyRowsAnalyzer';
import { analyzeDuplicateRows } from './duplicateRowsAnalyzer';
import { analyzeWhitespace } from './whitespaceAnalyzer';
import { analyzeHeaders } from './headerAnalyzer';

export interface CsvAnalyzer {
  (dataset: CsvDataset): CsvIssue[];
}

// Chạy tất cả các analyzers P0 trên dataset
export function runAllAnalyzers(dataset: CsvDataset): CsvIssue[] {
  const analyzers: CsvAnalyzer[] = [
    analyzeEmptyRows,
    analyzeDuplicateRows,
    analyzeWhitespace,
    analyzeHeaders
  ];

  const allIssues: CsvIssue[] = [];
  
  for (const analyzer of analyzers) {
    const issues = analyzer(dataset);
    allIssues.push(...issues);
  }

  return allIssues;
}