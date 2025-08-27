import React from 'react';

interface Props {
  lineNum: number;
  code: string;
  columnNum?: number;
  isIssueLine?: boolean;
}

const FeedbackContextLine: React.FC<Props> = ({
  lineNum,
  code,
  columnNum = 0,
  isIssueLine = false
}) => {
  if (isIssueLine) {
    return (
      <div className="group flex transition-colors duration-150 bg-red-900/20 border-l-2 border-l-red-500">
        <div className="flex-shrink-0 w-12 px-3 py-1 text-right border-r border-gray-700 select-none text-red-400 font-medium">
          {lineNum}
        </div>
        <div className="flex-1 px-3 py-1 min-w-0">
          <span className="whitespace-pre">{code}</span>

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
        {lineNum}
      </div>
      <div className="flex-1 px-3 py-1 min-w-0">
        <span className="whitespace-pre">{code}</span>
      </div>
    </div>
  );
};

export default FeedbackContextLine;
