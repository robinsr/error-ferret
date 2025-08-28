import React, { useState, useEffect } from 'react';
import { TAGLINES } from '@errorferret/branding';


const Header: React.FC = () => {
  const [tagline, setTagline] = useState<string>('');

  useEffect(() => {
    const randomTagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
    setTagline(randomTagline as string);
  }, []);

  return (
    <div className="flex items-center justify-center mb-4">
      <a href="/">
        <img
          src="/images/ferret_clipped.png"
          alt="Error Ferret Logo"
          className="w-70 h-45 mr-4"
        />
      </a>
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Error Ferret
        </h1>
        <p className="text-xl text-gray-600">
          {tagline}
        </p>
        <p className="text-base text-blue-400">
          <a href="/team">
            Meet the team
          </a>
        </p>

      </div>
    </div>
  );
};

export default Header;
