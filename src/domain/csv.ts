// src/domain/csv.ts
import type { CsvIssue } from "./issue";

export interface CsvDataset {
  headers: string[];
  rows: string[][];
  rowCount: number;
  columnCount: number;
}

export interface CsvDocument {
  fileName: string;
  fileSize: number;
  dataset: CsvDataset;
  issues: CsvIssue[];
  delimiter?: string;
  encoding?: string;
}