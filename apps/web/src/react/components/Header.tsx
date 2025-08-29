import React, { useState, useEffect } from 'react';
import { TAGLINES } from '@errorferret/branding';




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

const HamburgerButton: React.FC<{
  name: string;
  label: string;
  onClick: () => void;
}> = ({ name, label, onClick }) => {
  return (
    <button name={name} onClick={onClick} className="block w-full text-left py-2 px-4 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors">
      {label}
    </button>
  )
}

const HeaderLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return <a href={href} className="text-gray-300 hover:text-blue-400 transition-colors">{label}</a>
}

const HamburgerLink: React.FC<{
  href: string;
  label: string;
}> = ({ href, label }) => {
  return (
    <a href={href} className="block w-full text-left py-2 px-4 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors">
      {label}
    </a>
  )
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const randomTagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];

  const toggleMenu = () => {
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <HamburgerButton name="button-a" label="Button A" onClick={() => {}} />
            <HamburgerButton name="button-b" label="Button B" onClick={() => {}} />
            <HamburgerButton name="button-c" label="Button C" onClick={() => {}} />
            <HamburgerLink href="/team" label="Team" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
