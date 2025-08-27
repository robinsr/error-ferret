import React from 'react';

const colorSchemes = ['blue', 'green', 'yellow', 'red'] as const;
type ColorScheme = (typeof colorSchemes)[number];

const COLOR_SCHEMES: Record<ColorScheme, string> = {
  blue: 'from-blue-600 to-indigo-600',
  green: 'from-green-600 to-lime-600',
  yellow: 'from-yellow-600 to-amber-600',
  red: 'from-red-600 to-rose-600',
};

interface Props {
  title: string;
  description?: string;
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

const Section: React.FC<Props> = ({
  title,
  description,
  colorScheme = 'blue',
  children
}) => {
  const headerColorCls = COLOR_SCHEMES[colorScheme];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Section header */}
      <div className={`px-8 py-6 border-b border-gray-200 bg-gradient-to-r ${headerColorCls}`}>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>

        {description && (
          <p className="text-blue-100 mt-2">{description}</p>
        )}
      </div>

      {/* Section content */}
      {children}
    </div>
  );
};

export default Section;
