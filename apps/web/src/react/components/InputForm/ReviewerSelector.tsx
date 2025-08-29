import React from 'react';
import type { ReviewerProfile } from '@errorferret/reviewers';
import { FORM } from '@errorferret/branding';
import { FERRET_REVIEWERS } from '@errorferret/reviewers'
import ReviewerOption from './ReviewerOption';

interface Props {
  selectedReviewers: readonly ReviewerProfile[];
  onSelectionChange: (selected: ReviewerProfile[]) => void;
}

const ReviewerSelector: React.FC<Props> = ({
  selectedReviewers = [],
  onSelectionChange
}) => {

  const toggleReviewer = (reviewer: ReviewerProfile) => {
    const newReviewerSet = selectedReviewers.includes(reviewer)
      ? selectedReviewers.filter(r => r !== reviewer)
      : [...selectedReviewers, reviewer];

    onSelectionChange(newReviewerSet);
  };

  // const selectedReviewers = defaultSelectedReviewers

  // const toggleReviewer = (focus: string) => {
  //   console.log(`Toggling reviewer with focus: ${focus}`)
  // }

  return (
    <div className="w-full">
      <label htmlFor="reviewers" className="block text-sm font-medium text-gray-300 mb-3">
        Select Reviewers
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {FERRET_REVIEWERS.map((reviewer) => {
          const isSelected = selectedReviewers.includes(reviewer);
          return (
            <ReviewerOption
              key={reviewer.focus}
              reviewer={reviewer}
              isSelected={isSelected}
              onToggle={() => toggleReviewer(reviewer)}
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

      <p className="mt-2 text-sm text-gray-400">
        {FORM.REVIEWERS.HELP}
      </p>
    </div>
  );
};

export default ReviewerSelector;
