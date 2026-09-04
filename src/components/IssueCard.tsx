// src/components/IssueCard.tsx
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import type { CsvIssue } from './../domain/issue';

interface IssueCardProps {
  issue: CsvIssue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const isWarning = issue.severity === 'warning';
  
  return (
    <div className={`flex items-start p-4 rounded-lg border ${isWarning ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className="mt-0.5 mr-3">
        {isWarning ? (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        ) : (
          <Info className="h-5 w-5 text-blue-500" />
        )}
      </div>
      <div>
        <h4 className={`text-sm font-semibold ${isWarning ? 'text-amber-800' : 'text-blue-800'}`}>
          {issue.type.replace(/_/g, ' ')}
        </h4>
        <p className={`text-sm mt-1 ${isWarning ? 'text-amber-700' : 'text-blue-700'}`}>
          {issue.description}
        </p>
      </div>
    </div>
  );
}