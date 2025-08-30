import React from 'react';
import { FORM } from '@errorferret/branding';

interface Props {
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SubmitButton: React.FC<Props> = ({ disabled = false, onClick }) => {
  return (
    <button
      type="submit"
      id="submitButton"
      disabled={disabled}
      onClick={onClick}
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
      <span id="buttonText">{FORM.SUBMIT.LABEL}</span>
    </button>
  );
};

export default SubmitButton;
