import React, { useState, useEffect } from 'react';
import { TAGLINES } from '@errorferret/branding';

import HeaderLink from './HeaderLink.tsx';
import MobileButton from './MobileButton.tsx';
import MobileLink from './MobileLink.tsx';

import { Menu, XIcon } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const thisHour = new Date().getHours();

  const randomTagline = TAGLINES[thisHour % TAGLINES.length];

  const toggleMenu = () => {
    console.log('toggleMenu', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-zinc-800 shadow-md px-8 py-2 border-b-1 border-zinc-500">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center">
            <img
              src="/images/ferret_clipped.png"
              alt="Error Ferret Logo"
              className="w-12 h-8 object-contain"
            />
          </a>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-300">Error Ferret</h1>
            <p className="text-sm text-gray-300">{randomTagline}</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <HeaderLink href="/team" label="Team" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-gray-800 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <XIcon className="w-6 h-6" />
            ) : (
            <Menu className="w-6 h-6" />
            )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <MobileButton name="button-a" label="Button A" onClick={() => {}} />
            <MobileButton name="button-b" label="Button B" onClick={() => {}} />
            <MobileButton name="button-c" label="Button C" onClick={() => {}} />
            <MobileLink href="/team" label="Team" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
