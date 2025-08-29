import React from 'react'

interface FeedbackCommentProps {
  comment: string;
  avatarUrl: string;
}

const FeedbackComment: React.FC<FeedbackCommentProps> = ({ comment, avatarUrl }) => {
  return (
    <div className="px-4 py-4 bg-blue-900 border-t border-blue-700">
      <div className="p-2 bg-zinc-200 rounded-4xl">
        <div className="flex justify-center items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src={avatarUrl}
              alt="Error Ferret"
              className="w-16 h-16 rounded-full border-2 border-blue-600 shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base text-gray-900 leading-relaxed">{comment}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackComment;