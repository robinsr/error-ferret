import React, { useState, useEffect } from 'react';
import type { FerretReviewer } from '@errorferret/reviewers';
import { SELECT_FERRETS } from '@errorferret/branding';
import ReviewerOption from './ReviewerOption';

interface Props {
  reviewers: readonly FerretReviewer[];
  selectedReviewers?: string[];
  onSelectionChange?: (selectedReviewers: string[]) => void;
}

const ReviewerSelector: React.FC<Props> = ({
  reviewers,
  selectedReviewers: initialSelectedReviewers = [],
  onSelectionChange
}) => {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(initialSelectedReviewers);

  useEffect(() => {
    setSelectedReviewers(initialSelectedReviewers);
  }, [initialSelectedReviewers]);

  const toggleReviewer = (focus: string) => {
    const newSelectedReviewers = selectedReviewers.includes(focus)
      ? selectedReviewers.filter(r => r !== focus)
      : [...selectedReviewers, focus];

    setSelectedReviewers(newSelectedReviewers);
    onSelectionChange?.(newSelectedReviewers);
  };

  return (
    <div className="w-full">
      <label htmlFor="reviewers" className="block text-sm font-medium text-gray-700 mb-3">
        Select Reviewers
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {reviewers.map((reviewer) => {
          const isSelected = selectedReviewers.includes(reviewer.focus);
          return (
            <ReviewerOption
              key={reviewer.focus}
              reviewer={reviewer}
              isSelected={isSelected}
              onToggle={toggleReviewer}
            />
          );
        })}
      </div>

      {/* Hidden input to store selected reviewers */}
      <input
        type="hidden"
        name="selectedReviewers"
        id="selectedReviewersInput"
        value={selectedReviewers.join(',')}
      />

      <p className="mt-2 text-sm text-gray-500">
        {SELECT_FERRETS}
      </p>
    </div>
  );
};

export default ReviewerSelector;
