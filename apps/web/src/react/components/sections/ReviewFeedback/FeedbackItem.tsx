import type { ReviewFeedbackItem } from '@errorferret/types';

import React from 'react';

import FeedbackCodeBlock from './FeedbackCodeBlock.tsx';
import FeedbackLocation from './FeedbackLocation.tsx';
import FeedbackComment from './FeedbackComment.tsx';


interface Props {
  feedbackItem: ReviewFeedbackItem;
}

const FeedbackItem: React.FC<Props> = ({ feedbackItem }) => {
  const { comment, severity, reviewer, location, context } = feedbackItem;

  return (
    <div className="feedback-item bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 mx-4 overflow-clip">
      <FeedbackLocation location={location} />
      <FeedbackCodeBlock
        lines={context.lines}
        highlightLine={location.lineNumber}
      />
      <FeedbackComment
        comment={comment}
        avatarUrl={reviewer.imageUrl}
      />
    </div>
  );
};

export default FeedbackItem;
