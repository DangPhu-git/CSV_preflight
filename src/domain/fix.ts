// src/domain/fix.ts
import { CsvDataset } from "./csv";

export interface FixSelection {
  removeEmptyRows: boolean;
  removeDuplicateRows: boolean;
  trimWhitespace: boolean;
  normalizeHeaders: boolean;
  
  // P1 features
  removeEmptyColumns?: boolean;
  normalizeDates?: boolean;
}

export interface ChangeSummary {
  rowsRemoved: number;
  cellsCleaned: number;
  headersNormalized: number;
  
  // P1 features
  columnsRemoved?: number;
  datesNormalized?: number;
}

export interface TransformationResult {
  original: CsvDataset;
  transformed: CsvDataset;
  changes: ChangeSummary;
}