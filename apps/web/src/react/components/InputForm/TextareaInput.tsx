import React from 'react';

const CODE_PLACEHOLDER = `// Paste your code here...
// Example:
function calculateSum(a, b) {
    return a + b;
}`;

interface Props {
  name: string;
  label: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const TextareaInput: React.FC<Props> = ({
  name,
  label,
  required = true,
  onChange
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value);
  };

  const cls = [
    "block w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm",
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "resize-none font-mono text-sm",
    "bg-gray-50 text-gray-900 placeholder-gray-500",
    "transition-colors duration-200"
  ].join(' ');

  return (
    <div>
      <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-3">
        Code to Review
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          rows={20}
          required={required}
          placeholder={CODE_PLACEHOLDER}
          onChange={handleChange}
          className={cls}
        />

        {/* Pseudo-console traffic light buttons */}
        <div className="absolute top-3 right-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Our trained ferrets accept code in all major languages. Paste your work below and they'll return detailed findings.
      </p>
    </div>
  );
};

export default TextareaInput;
