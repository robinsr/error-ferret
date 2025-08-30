import React from 'react';

interface SelectInputOption {
  value: string;
  label: string;
}

interface Props {
  name: string;
  label: string;
  options: SelectInputOption[];
  selectedValue?: string;
  onChange?: (value: string) => void;
}

const SelectInput: React.FC<Props> = ({
  options,
  label,
  name,
  selectedValue = '',
  onChange
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-3">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={selectedValue}
        onChange={handleChange}
        className="block w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-white"
      >
        {options.map((option: SelectInputOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
