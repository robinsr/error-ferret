import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-800 shadow-lg border-t border-zinc-500 mt-auto">
      <div className="mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="/images/ferret_clipped.png"
              alt="Error Ferret Logo"
              className="w-10 h-7 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-300">Error Ferret</h2>
              <p className="text-sm text-gray-400">Code review automation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Home
            </a>
            <a
              href="/team"
              className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Team
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-zinc-600">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2024 Error Ferret. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Privacy Policy"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Terms of Service"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
