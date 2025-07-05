import React from 'react';

interface CardGridProps {
  title: string;
  children: React.ReactNode;
  gridColsClass: string; // e.g., "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  subtitle?: string;
}

export default function CardGrid({ title, children, gridColsClass, subtitle }: CardGridProps) {
  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">{title}</h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className={`grid gap-3 sm:gap-4 md:gap-6 ${gridColsClass}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
