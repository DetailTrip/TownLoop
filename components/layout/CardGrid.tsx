import React from 'react';

interface CardGridProps {
  title: string;
  children: React.ReactNode;
  gridColsClass: string; // e.g., "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function CardGrid({ title, children, gridColsClass, subtitle, showViewAll = false, viewAllHref = "/events" }: CardGridProps) {
  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 lg:mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-3">{title}</h2>
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <div className="hidden md:block">
              <a 
                href={viewAllHref}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
              >
                View All
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${gridColsClass}`}>
          {children}
        </div>
        {showViewAll && (
          <div className="md:hidden mt-6 text-center">
            <a 
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              View All Events
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
