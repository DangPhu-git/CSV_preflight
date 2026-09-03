export type IssueType =
  | "EMPTY_ROWS"
  | "DUPLICATE_ROWS"
  | "EXTRA_WHITESPACE"
  | "EMPTY_HEADER"
  | "DUPLICATE_HEADER"
  | "EMPTY_COLUMNS"          // P1
  | "INCONSISTENT_DATE_FORMAT"; // P1

export type IssueSeverity = "warning" | "possible";

export interface CsvIssue {
  type: IssueType;
  severity: IssueSeverity;
  count: number;
  description: string;
  fixAvailable: boolean;
}