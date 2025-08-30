import React from 'react';

const MobileLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return (
    <a href={href} className="block w-full text-left py-2 px-4 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors">
      {label}
    </a>
  )
}

export default MobileLink;