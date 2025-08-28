import type { ReviewFeedbackItem } from '@errorferret/types';

import React from 'react';
import { Info } from 'lucide-react'

import FeedbackLine from '@/react/components/ReviewFeedback/FeedbackLine';


interface Props {
  feedbackItem: ReviewFeedbackItem;
}

const FeedbackItem: React.FC<Props> = ({ feedbackItem }) => {
  const { comment, severity, reviewer, location, context } = feedbackItem;

  return (
    <div className="feedback-item bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 mx-4">

      {/* Header with line info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {location.filename
              ? `${location.filename}:${location.lineNumber}`
              : `Line: ${location.lineNumber}`}
          </span>
        </div>
      </div>

      {/* Code section */}
      <div className="relative">
        <div className="overflow-x-auto">
          <div className="min-w-full bg-gray-900 text-gray-100 font-mono text-sm">
            {context.lines.map((ctxLine) => (
              <FeedbackLine
                key={ctxLine.lineNumber}
                line={ctxLine}
                isIssueLine={ctxLine.lineNumber === location.lineNumber}
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
              src={reviewer.imageUrl}
              alt="Error Ferret"
              className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm"
            />
          </div>

          {/* Feedback text */}
          <div className="flex-1 min-w-0">
            <p className="text-base text-gray-800 leading-relaxed">{comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackItem;
