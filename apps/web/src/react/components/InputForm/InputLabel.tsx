import React from 'react';

interface Props {
  name: string;
  label: string;
}

const InputLabel: React.FC<Props> = ({ name, label }) => {
  return (
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-3">
      {label}
    </label>
  );
};

export default InputLabel;
