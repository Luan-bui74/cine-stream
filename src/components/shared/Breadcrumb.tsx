import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-brand-muted py-3 overflow-x-auto whitespace-nowrap">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-brand-text transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Trang chủ</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-brand-dim flex-shrink-0" />
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-brand-text transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-text font-medium line-clamp-1">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
