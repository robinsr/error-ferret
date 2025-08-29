import type { TextFileLocation } from '@errorferret/types';

import React from 'react'
import { Info } from 'lucide-react'

interface Props {
  location: TextFileLocation;
}

const RAW_TEXT_FILENAMES = ['text', 'raw']

const FeedbackLocation: React.FC<Props> = ({ location }) => {

  const hasFilename = RAW_TEXT_FILENAMES.includes(location.filename || 'text') == false

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-700 border-b border-gray-600">
      <Info className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-300">
        {hasFilename
          ? `${location.filename}:${location.lineNumber}`
          : `Line: ${location.lineNumber}`}
      </span>
    </div>
  )
};

export default FeedbackLocation;