import React from 'react';

const MobileButton: React.FC<{
  name: string;
  label: string;
  onClick: () => void;
}> = ({ name, label, onClick }) => {
  return (
    <button
      name={name}
      className="block w-full text-left py-2 px-4 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default MobileButton;