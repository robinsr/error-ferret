import type { FeedbackContextLine } from '@errorferret/types';

import React from 'react';

interface Props {
  line: FeedbackContextLine,
  isIssueLine?: boolean,
  columnNum?: number
}

const FeedbackLine: React.FC<Props> = ({ line, isIssueLine = false, columnNum = 0 }) => {

  if (isIssueLine) {
    return (
      <div className="group flex transition-colors duration-150 bg-red-900/20 border-l-2 border-l-red-500">
        <div className="flex-shrink-0 w-12 px-3 py-1 text-right border-r border-gray-700 select-none text-red-400 font-medium">
          {line.lineNumber}
        </div>
        <div className="flex-1 px-3 py-1 min-w-0">
          <span className="whitespace-pre">{line.code}</span>

          {columnNum > 1 && (
            <span className="inline-block ml-1 text-red-400">
              {Array.from({ length: columnNum - 1 }, () => ' ').join('')}↑
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex transition-colors duration-150 hover:bg-gray-800">
      <div className="flex-shrink-0 w-12 px-3 py-1 text-right border-r border-gray-700 select-none text-gray-500">
        {line.lineNumber}
      </div>
      <div className="flex-1 px-3 py-1 min-w-0">
        <span className="whitespace-pre">{line.code}</span>
      </div>
    </div>
  );
};

export default FeedbackLine;
