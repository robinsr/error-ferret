import React from 'react';

interface CodeReference {
  lineNum: number;
  code: string;
}

interface FeedbackItemProps {
  feedbackItem: {
    lineNum: number;
    columnNum: number;
    code: string;
    contextLines: CodeReference[];
    feedback: string;
  };
}

interface FeedbackContextLineProps {
  lineNum: number;
  code: string;
  columnNum?: number;
  isIssueLine?: boolean;
}

const FeedbackContextLine: React.FC<FeedbackContextLineProps> = ({
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

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedbackItem }) => {
  const { lineNum, columnNum, code, contextLines, feedback } = feedbackItem;

  return (
    <div className="feedback-item bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 mx-4">
      {/* Header with line info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Line {lineNum}</span>
        </div>
      </div>

      {/* Code section */}
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-full bg-gray-900 text-gray-100 font-mono text-sm">
            {contextLines.map((ctxLine) => (
              <FeedbackContextLine
                key={ctxLine.lineNum}
                lineNum={ctxLine.lineNum}
                code={ctxLine.code}
                columnNum={columnNum}
                isIssueLine={ctxLine.lineNum === lineNum}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feedback section */}
      <div className="px-4 py-4 bg-blue-50 border-t border-blue-200 rounded-b-lg">
        <div className="flex justify-center items-center gap-3">
          {/* Error Ferret Avatar */}
          <div className="flex-shrink-0">
            <img
              src="/images/ferret_avatar.jpg"
              alt="Error Ferret"
              className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm"
            />
          </div>

          {/* Feedback text */}
          <div className="flex-1 min-w-0">
            <p className="text-base text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackItem;
