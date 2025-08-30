import React from 'react';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const TrafficLights: React.FC = () => {
  return (
    <div className="absolute top-3 right-3">
      <div className="flex space-x-1">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
    </div>
  )
}

const TextareaInput: React.FC<Props> = ({
  name,
  label,
  placeholder = "",
  required = true,
  onChange
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value);
  };

  const cls = [
    "block w-full px-4 py-4 border border-gray-600 rounded-lg shadow-sm",
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "resize-none font-mono text-sm",
    "bg-gray-800 text-white placeholder-gray-400",
    "transition-colors duration-200"
  ].join(' ');

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-3">
        {label}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          rows={20}
          required={required}
          placeholder={placeholder}
          onChange={handleChange}
          className={cls}
        />

        <TrafficLights />
      </div>
    </div>
  );
};

export default TextareaInput;
