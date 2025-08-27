import React from 'react';
import type { ReviewerProfile } from '@errorferret/reviewers';

interface Props {
  reviewer: ReviewerProfile;
  isSelected: boolean;
  onToggle: () => void;
}

const ReviewerOption: React.FC<Props> = ({ reviewer, isSelected, onToggle }) => {

  return (
    <button
      type="button"
      data-reviewer-focus={reviewer.focus}
      onClick={onToggle}
      className={`group relative flex flex-col w-full items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-gray-200">
        <img
          src={reviewer.imageUrl}
          alt={`${reviewer.name} avatar`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <span className={`font-semibold text-sm ${
        isSelected ? 'text-blue-700' : 'text-gray-900'
      }`}>
        {reviewer.name}
      </span>

      {/* Title */}
      <span className={`text-xs text-center ${
        isSelected ? 'text-blue-600' : 'text-gray-600'
      }`}>
        {reviewer.title}
      </span>

      {/* Selection indicator - pre-rendered and hidden by default */}
      <div className={`selection-indicator absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ${isSelected ? '' : 'hidden'}`}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </button>
  );
};

export default ReviewerOption;
