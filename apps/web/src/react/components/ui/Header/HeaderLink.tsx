import React from 'react';

const HeaderLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return <a href={href} className="text-gray-300 hover:text-blue-400 transition-colors">{label}</a>
}

export default HeaderLink;