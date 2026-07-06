'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({ badge, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {badge && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-[#FF6B35] mb-3">
          {badge}
        </span>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{description}</p>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
