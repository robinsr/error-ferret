import type { FeedbackContextLine } from "@errorferret/types";

import React from 'react';
import FeedbackLine from "./FeedbackLine";

interface Props {
  lines: FeedbackContextLine[];
  highlightLine: number;
}

const FeedbackCodeBlock: React.FC<Props> = ({ lines, highlightLine }) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="min-w-full bg-gray-900 text-gray-100 font-mono text-sm">
          {lines.map((line) => (
            <FeedbackLine
              key={line.lineNumber}
              line={line}
              isIssueLine={line.lineNumber === highlightLine}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCodeBlock;