import React from 'react';

interface CardGridProps {
  title: string;
  children: React.ReactNode;
  gridColsClass: string; // e.g., "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}

export default function CardGrid({ title, children, gridColsClass }: CardGridProps) {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className={`grid gap-6 ${gridColsClass}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
