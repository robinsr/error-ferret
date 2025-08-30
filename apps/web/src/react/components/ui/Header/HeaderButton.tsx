import React from 'react';

const HeaderButton: React.FC<{
  name: string;
  label: string;
  onClick: () => void;
}> = ({ label, name, onClick }) => {
  return (
    <button name={name} onClick={onClick} className="text-gray-300 hover:text-blue-400 transition-colors">
      {label}
    </button>
  )
}

export default HeaderButton;