import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  percentage: number;
}

export function ProgressBar({ percentage }: ProgressBarProps) {
  const isComplete = percentage >= 100;

  return (
    <div className="relative">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-blue-600'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          <span className="absolute w-full text-center text-xs text-white leading-4">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      {isComplete && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-green-500">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Todos os cursos concluídos!</span>
        </div>
      )}
    </div>
  );
}