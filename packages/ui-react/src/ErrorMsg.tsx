import React from 'react';

interface Props {
  error: string;
  onTryAgain?: () => void;
  onClearForm?: () => void;
}

const ErrorMsg: React.FC<Props> = ({ error, onTryAgain, onClearForm }) => {
  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
    } else {
      window.location.reload();
    }
  };

  const handleClearForm = () => {
    if (onClearForm) {
      onClearForm();
    } else {
      const reviewForm = document.getElementById('reviewForm') as HTMLFormElement;
      const code = document.getElementById('code') as HTMLTextAreaElement;
      if (reviewForm) reviewForm.reset();
      if (code) code.value = '';
    }
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-start gap-4">
        {/* Error Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">Something went wrong</p>
            <p className="text-red-700 text-sm leading-relaxed">{error}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleTryAgain}
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>

            <button
              onClick={handleClearForm}
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMsg;
